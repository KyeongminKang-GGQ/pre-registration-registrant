import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

console.log(process.env);

const app = createApp(App);

app.config.globalProperties.AUTHORIZED = [
  "kyeongmin.kang@ggq.gg",
  "seungmin.ha@ggq.gg",
  "ilhong.jang@ggq.gg",
  "garham.kwon@ggq.gg",
];

app.use(router).mount("#app");
