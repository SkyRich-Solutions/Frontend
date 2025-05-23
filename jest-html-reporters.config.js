const path = require("path");

module.exports = {
  publicPath: "./",
  filename: "test-report.html",
  expand: true,
  pageTitle: "Frontend Unit Test Report",
  outputPath: path.resolve(__dirname)
};
