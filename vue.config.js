module.exports = {
  // devServer Options don't belong into `configureWebpack`
  devServer: {
    host: "localhost",
    hot: true,
    disableHostCheck: true
  }
};
