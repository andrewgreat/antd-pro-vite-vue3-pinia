const VueAxios = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  installed: false,
  install (Vue, instance) {
    if (this.installed) {
      return
    }
    this.installed = true

    if (!instance) {
      // eslint-disable-next-line no-console
      console.error('You have to install axios')
      return
    }

    Vue.axios = instance

    Vue.config.globalProperties['axios'] = instance;
    Vue['axios'] = {
      get:  () => {
        return instance
      }
    };
    Vue.config.globalProperties['$http'] = instance;
    Vue['$http'] = {
      get: () => {
        return instance
      }
    };

  }
}

export {
  VueAxios
}
