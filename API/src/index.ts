import express from "express";
import http from "http";
import "dotenv/config";
import mysql from "mysql2";
import { createSchema, createYoga } from "graphql-yoga";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import schema from "./graphql/schema";

const PORT = process.env.PORT || 3000;
const app = express();

export const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })
  .promise();

const yoga = createYoga({ schema });

app.use(yoga.graphqlEndpoint, yoga);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
