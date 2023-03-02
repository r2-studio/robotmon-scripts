const path = require("path");

module.exports = {
  target: "es5",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    chunkFormat: 'array-push',
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
  },
};
