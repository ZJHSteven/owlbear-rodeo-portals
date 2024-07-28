const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const meta = require("./package.json");
const CaseSensitivePathsPlugin = require("@umijs/case-sensitive-paths-webpack-plugin");
const child_process = require("child_process");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const gitRef = isProduction ? "HEAD" : "origin/main";
  const gitId = child_process
    .execFileSync("git", ["rev-parse", gitRef], { encoding: "utf8" })
    .trim();

  return {
    mode: "development",
    entry: {
      background: "./src/background/main.ts",
      changelog: "./src/changelog/main.tsx",
    },
    devtool: isProduction ? undefined : "eval-cheap-source-map",
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
        filename: `changelog.html`,
        favicon: "static/font-awesome/svgs/dungeon-solid.svg",
        chunks: ["changelog"],
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
              if (!isProduction) {
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
                .replaceAll("$GITLAB_PAGES$", meta.config.GITLAB_PAGES)
                .replaceAll("$GIT_ID$", gitId);
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
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: "local",
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
                // https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup
                // runtime automatic becomes default in Babel 8
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
  };
};
