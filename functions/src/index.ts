import * as functions from "firebase-functions";
import * as express from "express";
// import * as graphqlHTTP from "express-graphql";
// import { buildSchema } from "graphql";
import * as admin from "firebase-admin";
// import Vue from "vue";
// import { createRenderer } from "vue-server-renderer";
// import App from "../client/Components/App";

const app = express();
// const renderer = createRenderer();
// const vueApp = new Vue({ template });

admin.initializeApp();

app.get("*", (req, res) => {
  // const vueApp = renderer.renderToString();
});

app.use(express.static("public"));

exports.app = functions.https.onRequest(app);
