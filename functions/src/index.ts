import * as functions from "firebase-functions";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import * as admin from "firebase-admin";
import Roomba from "./Roomba";

const app = express();

admin.initializeApp();

const schema = buildSchema(`
  type RoombaResult {
    resultString: String
    traversalSteps: [[Int]]
    dirtLocations: [String]
    finalPositionRaw: [Int]
    initialPositionRaw: [Int]
    dirtCount: String
    finalMatrix: String
    originalMatrix: String
    directions: String
  }

  type Query {
    traversalResults(input: String): RoombaResult
  }
`);

const root = {
  traversalResults({ input }: { input: string }) {
    const roomba = new Roomba();
    roomba.ingestInput(input);

    return roomba.traverse();
  },
};

app.use(express.static("public"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

exports.roombas = functions.https.onRequest(app);
