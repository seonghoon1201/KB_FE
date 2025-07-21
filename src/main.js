<<<<<<< HEAD
import "./assets/tailwind.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
=======
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import './assets/main.css'

import * as lucide from 'lucide-vue-next'

const app = createApp(App)

for (const [key, component] of Object.entries(lucide)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.mount('#app')
>>>>>>> upstream/main
