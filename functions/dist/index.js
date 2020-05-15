"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
// import * as graphqlHTTP from "express-graphql";
// import { buildSchema } from "graphql";
const admin = require("firebase-admin");
// import * as app from "../client/main.js";
// import Roomba from "./Roomba";
const app = express();
admin.initializeApp();
// const schema = buildSchema(`
//   type RoombaResult {
//     resultString: String
//     traversalSteps: [[Int]]
//     dirtLocations: [String]
//     finalPositionRaw: [Int]
//     initialPositionRaw: [Int]
//     dirtCount: String
//     finalMatrix: String
//     originalMatrix: String
//     directions: String
//   }
//   type Query {
//     traversalResults(input: String): RoombaResult
//   }
// `);
// const root = {
//   traversalResults({ input }: { input: string }) {
//     const roomba = new Roomba();
//     roomba.ingestInput(input);
//     return roomba.traverse();
//   },
// };
app.use(express.static("public"));
// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
//   })
// );
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map