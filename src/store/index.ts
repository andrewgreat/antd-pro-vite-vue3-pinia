import type { App } from 'vue';
import { createPinia } from "pinia";

console.log("main.ts...", "store");

const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export default store ;
