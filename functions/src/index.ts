import * as functions from "firebase-functions";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import * as admin from "firebase-admin";

const app = express();

admin.initializeApp();

const schema = buildSchema(`

  type Hand {
    flop: [String]
    hole: [String]
    river: String
    turn: String
    deck: [String]
  }

  type Query {
   randomHand: Hand
   potOdds(bet: Int, pot: Int): Float
  }
`);

const cards = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
const suits = ["C", "S", "H", "D"];

const deck = cards.reduce((output: string[], c: string) => {
  output.push(...suits.map((s: string) => `${c}${s}`));
  return output;
}, []);

const swap = (arr: any[], i: number, j: number) => {
  const hannah = arr[i];
  arr[i] = arr[j];
  arr[j] = hannah;
};

const shuffle = (arr: any[]) => {
  for (let i = 0; i < arr.length; i++) {
    const swapIdx = i + Math.floor(Math.random() * (arr.length - i - 1));
    swap(arr, i, swapIdx);
  }
  return arr;
};

const root = {
  randomHand() {
    const shuffledDeck = shuffle([...deck]);

    return {
      hole: shuffledDeck.slice(0, 2),
      flop: shuffledDeck.slice(2, 5),
      turn: shuffledDeck[5],
      river: shuffledDeck[6],
      deck: shuffledDeck.slice(7),
    };
  },
  potOdds({ bet, pot }: { bet: number; pot: number }): number {
    return +(bet / (pot + bet)).toFixed(2);
  },
};

app.use(express.static("public"));

app.use(
  "/graphql",
  graphqlHTTP({
    rootValue: root,
    graphiql: true,
    schema,
  })
);

exports.app = functions.https.onRequest(app);
