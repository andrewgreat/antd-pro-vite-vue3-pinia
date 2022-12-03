import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";

console.log("main.ts...", "store");

const store = createPinia();
store.use(piniaPersist);

export function setupStore(app: App<Element>) {
  app.use(store);
  store.use(piniaPersist);
}

export default store;
