import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { createSchema } from "graphql-yoga";
import user from "./types/user";
import userQueries from "./resolvers/user";
import genericTypes from "./types/genericTypes";

const typeDefs = mergeTypeDefs([user, genericTypes]);
const resolvers = mergeResolvers([userQueries]);

const schema = createSchema({ typeDefs: typeDefs, resolvers: resolvers });

export default schema;
