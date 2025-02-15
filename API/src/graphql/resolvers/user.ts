import { GraphQLSchemaWithContext } from "graphql-yoga";
import { GqlContext } from "../../types/gql";
import admin from "../../config/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";
import { pool } from "../..";

const user = {
  Query: {
    users: async () => {
      return [{ id: 1, username: "John Doe", email: "kdoekdoe@gmail.com" }];
    },
  },

  Mutation: {
    createUser: async (_: unknown, args: { username: string; email: string }, context: GqlContext) => {
      const decodedToken = await context;
      if (!decodedToken) throw new GraphQLError("Sign in to continue");

      const connection = await pool.getConnection().catch(() => {
        throw new GraphQLError("Internal server error, please try again later.");
      });

      try {
        const checkQuery = `
        SELECT 
            EXISTS(SELECT 1 FROM users WHERE uid = ?) AS uidExists, 
            EXISTS(SELECT 1 FROM users WHERE username = ?) AS usernameExists, 
            EXISTS(SELECT 1 FROM users WHERE email = ?) AS emailExists
    `;

        const [checkRows] = await connection.query(checkQuery, [decodedToken.uid, args.username, args.email]);

        const { uidExists, usernameExists, emailExists } = checkRows[0 as keyof typeof checkRows];

        if (usernameExists) throw new GraphQLError("Username already in use");
        if (uidExists) throw new GraphQLError("User already exists");
        if (emailExists) throw new GraphQLError("Email already in use");

        const insertQuery = `
        INSERT INTO users (uid, username, email) VALUES (?, ?, ?)
    `;
        await connection.query(insertQuery, [decodedToken.uid, args.username, args.email]);

        return { username: args.username, email: args.email };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError("Internal server error, please try again later.");
      } finally {
        connection.release();
      }
    },
    handleEmailConflict: async (_: unknown, args: { email: string }) => {
      const user = await admin.auth().getUserByEmail(args.email);
      if (!user) throw new GraphQLError("User not found.");

      if (!user.emailVerified) {
        await admin
          .auth()
          .updateUser(user.uid, { email: `${uuidv4()}@deleted.com` })
          .catch(() => {
            throw new GraphQLError("Internal server error, please try again later.");
          });

        return { success: true };
      } else {
        throw new GraphQLError("Email already in use.");
      }
    },
  },
};

export default user;
