/* eslint-disable */
/**
 * Webpack Config
 */
// const webpack = require('webpack');
const path = require("path");
const fs = require("fs");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require("dotenv-webpack");
require("dotenv").config();
// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = "/";

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// plugins
// const autoprefixer = require('autoprefixer');
const safePostCssParser = require("postcss-safe-parser");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const isEnvProduction = process.env.NODE_ENV === "production";
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

module.exports = {
  entry: ["babel-polyfill", "react-hot-loader/patch", "./src/index.js"],
  output: {
    // The build folder.
    path: resolveApp("build"),
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: "static/js/[name].[hash:8].js",
    chunkFilename: "static/js/[name].[hash:8].chunk.js",
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath,
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  devServer: {
    contentBase: "./src/index.js",
    host: "0.0.0.0",
    compress: true,
    port: process.env.PORT, // port number
    historyApiFallback: true,
    quiet: true,
  },
  // resolve alias (Absolute paths)
  resolve: {
    alias: {
      Actions: path.resolve(__dirname, "src/actions/"),
      Components: path.resolve(__dirname, "src/components/"),
      Assets: path.resolve(__dirname, "src/assets/"),
      Util: path.resolve(__dirname, "src/util/"),
      Routes: path.resolve(__dirname, "src/routes/"),
      Constants: path.resolve(__dirname, "src/constants/"),
      Helpers: path.resolve(__dirname, "src/helpers/"),
      Api: path.resolve(__dirname, "src/api/"),
      gql: path.resolve(__dirname, "src/gql/"),
      functions: path.resolve(__dirname, "src/functions/"),
      validations: path.resolve(__dirname, "src/validations/"),
      hooks: path.resolve(__dirname, "src/hooks/"),
      actions: path.resolve(__dirname, "src/actions/"),
      components: path.resolve(__dirname, "src/components/"),
      assets: path.resolve(__dirname, "src/assets/"),
      util: path.resolve(__dirname, "src/util/"),
      routes: path.resolve(__dirname, "src/routes/"),
      constants: path.resolve(__dirname, "src/constants/"),
      helpers: path.resolve(__dirname, "src/helpers/"),
      api: path.resolve(__dirname, "src/api/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      // Scss compiler
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "style-loader", // inject CSS to page
          },
          {
            loader: "css-loader", // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              plugins() {
                // post css plugins, can be exported to postcss.config.js
                return [require("precss"), require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: require.resolve("graphql-tag/loader"),
      },
    ],
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       // Enable file caching
  //       cache: true,
  //       // Use multi-process parallel running to improve the build speed
  //       // Default number of concurrent runs: os.cpus().length - 1
  //       parallel: true,

  //       uglifyOptions: {
  //         compress: false,
  //         ecma: 8,
  //         mangle: true,
  //       },
  //       sourceMap: true,
  //     }),
  //   ],
  // },
  optimization: {
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
        cssProcessorPluginOptions: {
          preset: ["default", { minifyFontValues: { removeQuotes: false } }],
        },
      }),
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: "all",
      name: false,
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  plugins: [
    new Dotenv(),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin({
      dry: false,
      verbose: false,
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "static/css/[name].[hash:8].css",
    }),
    // new BundleAnalyzerPlugin()
  ],
};
