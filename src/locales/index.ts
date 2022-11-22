import { createI18n, useI18n } from 'vue-i18n'
import storage from 'store'

console.log('main.ts...','i18n')
// default lang
import zhCN from './lang/zhCN'
import enUS from './lang/enUS'
export const defaultLang = storage.get('lang') || 'zhCN'

const messages = {
  zhCN: {
    ...zhCN
  },
  enUS: {
    ...enUS
  }
}

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages
})

const loadedLanguages = [defaultLang]

export function setI18nLanguage(lang) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = lang;
  } else {
    i18n.global.locale.value = lang;
  }
  loadedLanguages.push()
  // axios.defaults.headers.common['Accept-Language'] = locale
  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

// const modules = import.meta.glob('../views/*/*.vue')
export function loadLanguageAsync(lang = defaultLang) {
  return new Promise(resolve => {
    // 缓存语言设置
    storage.set('lang', lang)
    if (i18n.global.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(`./lang/${lang}.ts`).then(msg => {
          const message = msg.default
          i18n.global.setLocaleMessage(lang, message)
          loadedLanguages.push(lang)
          console.log(message)
          // console.log(moment.updateLocale(message.momentName, message.momentLocale))
          return setI18nLanguage(lang)
        })
      }
      return resolve(setI18nLanguage(lang))
    }
    return resolve(lang)
  })
}

export function t(key) {
  return useI18n().t(`${key}`)
}

export default i18n
