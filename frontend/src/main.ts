import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");

// mongoose
//   .connect("mongodb://localhost:27017")
//   .then(() => console.log("MongoDB database Connected..."))
//   .catch((err) => console.log(err));
