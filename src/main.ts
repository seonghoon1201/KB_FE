import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import tailwindcss from "@tailwindcss/vite";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(tailwindcss);

app.mount("#app");
