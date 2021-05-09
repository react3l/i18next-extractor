const path = require("path");
const nameof = require("ts-nameof");
const webpack = require("webpack");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    "index": path.resolve(__dirname, "src", "index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  target: "node",
  devtool: mode === 'development' ? "source-map" : false,
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ],
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers() {
                return {
                  before: [
                    nameof,
                  ],
                };
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
};
