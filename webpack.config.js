const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const PATHS = {
    app: path.resolve(__dirname, 'app'),
    build: path.resolve(__dirname, 'build')
};
module.exports = {
    mode: "development",
    cache: true,
    //devtool: 'source-map',
    entry: {
        list: PATHS.app + "/list.js",
        //calculette: PATHS.app + "/calculette.js",
        tableau: PATHS.app + "/tableau.js"
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.common.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.png$/,
                use: "url-loader?limit=100000"
            },
            {
                test: /\.jpg$/,
                use: "file-loader"
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {

                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
            },
            {

                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    devServer : {
        contentBase: './build',
        port: 8001
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "app/*.html", flatten: true },
                { from: "app/css", to: "css"}
            ]
        }),
    ]
};