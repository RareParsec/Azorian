import express from "express";
import http from "http";
import "dotenv/config";
import mysql from "mysql2";
import { createYoga } from "graphql-yoga";
import schema from "./graphql/schema";
import createContext from "./graphql/context";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

export const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })
  .promise();

const yoga = createYoga({
  schema,
  maskedErrors: process.env.NODE_ENV !== 'development' ? true : false, // Show full errors in dev
  logging: process.env.NODE_ENV === 'development', // Enable logging in dev mode
  context: ({ request }) => {
    createContext({ request });
  },
});

app.use(yoga.graphqlEndpoint, yoga);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
