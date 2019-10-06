const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginFunctions = require('less-plugin-functions');


/**********************************************************************************************************************/
const oBabelLoader = {
    loader: 'babel-loader',
    options: {
        presets: ['@babel/env'],
        plugins: [
            '@babel/plugin-proposal-object-rest-spread', // Spread operator doesn't work without this plugin.
            '@babel/plugin-proposal-class-properties'
        ]
    }
};

const oMiniCssLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        publicPath: '../',
        hmr: process.env.NODE_ENV === 'development'
    }
};

const oCssLoader = {
    loader: 'css-loader',
    options: {
        minimize: true,
        sourceMap: true // Source Map doesn't work with mini-css-extract-plugin
    }
};

const oLessLoader = {
    loader: 'less-loader',
    options: {
        sourceMap: true,
        strictUnits: true,
        plugins: [new LessPluginFunctions()]
    }
};


/**********************************************************************************************************************/
const config = {
    target: 'web',

    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/',
        filename: 'bundle.js'
    },

    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [oBabelLoader]
        }, {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [oBabelLoader, 'ts-loader']
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                // oMiniCssLoader,
                'style-loader',
                oCssLoader
            ]
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
                // oMiniCssLoader,
                'style-loader',
                oCssLoader,
                oLessLoader
            ]
        }]
    },

    resolve: { extensions: ['*', '.js', '.jsx', '.ts'] },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({ filename: 'style.css' }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        port: 3000,
        hotOnly: true
    }
};


/**********************************************************************************************************************/
module.exports = function(env, argv) {
    if (argv.mode === 'production') {
        config.plugins.push(
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
        );
    } else {
        config.devtool = 'eval-source-map';
    }
    return config;
};