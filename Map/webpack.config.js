
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/"),
            "assert": require.resolve("assert/"),
            "constants": require.resolve("constants-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "url": require.resolve("url/"),
            "fs": require.resolve("fs"),
            "zlib": require.resolve("browserify-zlib"),
            "vm": require.resolve("vm-browserify"),
            "tty": require.resolve("tty-browserify"),
            "process": require.resolve("process/browser"),
            "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        }

        // node: {
        //   fs: 'empty',
        //   net: 'empty',
        //   tls: 'empty'
        // },
    },
    //use babel.config.json
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            }
        ],
    },
    
}