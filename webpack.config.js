module.exports = {
    context: __dirname,
    entry: "./src",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    watchOptions: { poll: 1000, aggregateTimeout: 300 }
}
