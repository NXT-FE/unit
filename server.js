const webpack = require("webpack");
const package = require("./package.json");
const webpackDevMiddleware = require("webpack-dev-middleware");
var http = require("http");
const express = require("express");
const app = express();
const config = require("./webpack.dev");
const compiler = webpack(config);
const child_process = require("child_process");
const url = `http://localhost:${package.port}${package.page}`;
// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        logLevel: "error"
    })
);
app.use(
    require("webpack-hot-middleware")(compiler, {
        log: console.log,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
    })
);
// Serve the files on port.
var server = http.createServer(app);
server.listen(package.port, function () {
    console.log("Listening on %j", server.address());
    if (process.platform === "win32") {
        cmd = "start";
    } else if (process.platform === "linux") {
        cmd = "xdg-open";
    } else if (process.platform === "darwin") {
        cmd = "open";
    }
    child_process.exec(`${cmd} ${url}`);
});