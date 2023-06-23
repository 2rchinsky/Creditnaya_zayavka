const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production";
}
console.log(mode + " mode");

module.exports = {
  mode: mode,
  entry: {
    scripts: "./src/index.js",
    user: "./src/user.js",
  },
  output: {
    filename: "bundle/[name].js",
    assetModuleFilename: "images/[name][ext][query]",
    chunkFilename: "bundle/[name].js",
    // assetModuleFilename: "assets/[hash][ext][query]",
    clean: true,
  },
  devServer: {
    open: true,
    port: 3333,
    host: "127.0.0.1",
    static: {
      directory: "./src",
      watch: true,
    },
  },
  devtool: "source-map",
  optimization: {
    // splitChunks: {
    //   chunks: "all",
    // },
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, ///< put all used node_modules modules in this chunk
          name: "vendor", ///< name of bundle
          chunks: "all", ///< type of code to put in this bundle
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.pug"),
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/additionally.pug"),
      filename: "additionally.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/success.pug"),
      filename: "success.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/fail.pug"),
      filename: "fail.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/completion.pug"),
      filename: "completion.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "@webdiscus/pug-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      outputPath: "fonts/",
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      // {
      //     test: /\.pug$/,
      //     loader: 'pug-loader',
      //     exclude: /(node_modules|bower_components)/,
      // },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // options: {
          //     presets: ['@babel/preset-env']
          // }
        },
      },
    ],
  },
};
