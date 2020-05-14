const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const OUTPUT_DIR = path.resolve(__dirname, "public");
const ENTRY_POINT = path.resolve(__dirname, "client/main.js");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: ENTRY_POINT,
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: OUTPUT_DIR,
  },
  devtool: "source-map",
  mode: isProd ? "production" : "development",
  resolve: {
    extensions: [".js", ".vue"],
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },

  plugins: [new VueLoaderPlugin()],
};
