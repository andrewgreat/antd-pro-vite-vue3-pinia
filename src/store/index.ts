import type { App } from 'vue';
import { createPinia } from "pinia";
// import { state } from './state';
// import app from './modules/app'
// import user from './modules/user'
// import permission from './modules/async-router'
// import { createStore } from 'vuex';
// import getters from '@/store/getters';
console.log("main.ts...", "store");

const store = createPinia();

// const store = createStore({
//   modules: {
//     app,
//     user,
//     permission
//   },
//   state,
//   getters,
//   mutations: {},
//   actions: {},
// });

export function setupStore(app: App<Element>) {
  app.use(store);
}

export default store ;
