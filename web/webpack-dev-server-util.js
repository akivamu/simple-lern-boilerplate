"use strict";

const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const devConfig = require('./webpack.dev.config.js');

const compiler = webpack(devConfig);
const middleware = webpackDevMiddleware(compiler, {
    publicPath: devConfig.output.publicPath,
    stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
    }
});

module.exports = {
    appendMiddleware: function (expressApp) {
        expressApp.use(middleware);
        expressApp.use(webpackHotMiddleware(compiler));
        expressApp.get('*', function response(req, res) {
            res.write(middleware.fileSystem.readFileSync(path.join(devConfig.output.path, 'index.html')));
            res.end();
        });
    }
};