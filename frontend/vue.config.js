const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // https: false,
    // host: "0.0.0.0",
    allowedHosts: "all",
    proxy: {
      "/preregistered-email": {
        target: "http://localhost:3000/preregistered-email",
        changeOrigin: true,
        pathRewrite: {
          "^/preregistered-email": "",
        },
      },
    },
  },
});
