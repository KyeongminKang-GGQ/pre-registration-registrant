const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // https: false,
    // host: "0.0.0.0",
    allowedHosts: "all",
    proxy: {
      "/preregistered-email": {
        target: `${process.env.VUE_APP_LOCAL_SERVER}/preregistered-email`,
        changeOrigin: true,
        pathRewrite: {
          "^/preregistered-email": "",
        },
      },
      "/login": {
        target: `${process.env.VUE_APP_LOCAL_SERVER}/login`,
        changeOrigin: true,
        pathRewrite: {
          "^/login": "",
        },
      },
    },
  },
});
