const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const meta = require("./package.json");
const CaseSensitivePathsPlugin = require("@umijs/case-sensitive-paths-webpack-plugin");

module.exports = (env, argv) => ({
  mode: "development",
  entry: {
    background: "./src/background/main.ts",
    followTokensPopover: "./src/teleport/followTokensPopover/main.ts",
  },
  devServer: {
    server: "https",
    devMiddleware: {
      publicPath: "/owlbear-rodeo-portals",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      title: meta.name,
      filename: `background.html`,
      favicon: "static/font-awesome/svgs/dungeon-solid.svg",
      chunks: ["background"],
    }),
    new HtmlWebpackPlugin({
      title: meta.name,
      filename: `followTokensPopover.html`,
      favicon: "static/font-awesome/svgs/dungeon-solid.svg",
      chunks: ["followTokensPopover"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: "static/",
          globOptions: {
            ignore: ["**/*.{json,md}"],
          },
        },
        {
          from: "**/*.{json,md}",
          context: "static/",
          transform(content) {
            let name = meta.name;
            let version = meta.version;
            if (argv.mode !== "production") {
              name += " (Development)";
              version += "-dev";
            }

            return content
              .toString()
              .replaceAll("$VERSION$", version)
              .replaceAll("$BUILD_DATE_TIME$", new Date().toISOString())
              .replaceAll("$NAME$", name)
              .replaceAll("$DESCRIPTION$", meta.description)
              .replaceAll("$AUTHOR$", meta.author.name)
              .replaceAll("$HOMEPAGE$", meta.homepage)
              .replaceAll("$GITLAB_PAGES$", meta.config.GITLAB_PAGES);
          },
        },
      ],
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "public"),
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
});
