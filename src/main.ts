import { createApp } from "vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import { createPinia } from "pinia";
import "@/access";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import App from "./App.vue";

const pinia = createPinia();
createApp(App)
  .use(pinia)
  .use(ArcoVue)
  .use(router)
  .use(ArcoVueIcon)
  .mount("#app");
