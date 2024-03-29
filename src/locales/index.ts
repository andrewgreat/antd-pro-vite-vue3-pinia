import type { App } from "vue";
import { createI18n } from "vue-i18n";
import storage from "store";

console.log("main.ts...", "i18n");

// default lang
import zhCN from "./lang/zh-CN";
import enUS from "./lang/en-US";
import zhTW from "./lang/zh-TW";

function getStandLang(localLang: string) {
  let langRet = "zh-CN";
  const localLangs = [
    {
      key: "zh-CN",
      tip: "简体中文",
      langs: ["zh-CN", "zhCN", "zh-cn", "zh", "zhcn"],
    },
    {
      key: "en-US",
      tip: "English",
      langs: ["en-US", "enUS", "en-us", "en", "enus"],
    },
    {
      key: "zh-TW",
      tip: "繁體中文",
      langs: ["zh-TW", "zhTW", "zh-tw", "zhtw"],
    },
  ];
  localLangs.some(
    (item) =>
      item.langs.some((lang) => lang === localLang) && (langRet = item.key)
  );
  return langRet;
}

export const defaultLang = getStandLang(storage.get("lang") || "zh-CN");

const messages = {
  ["zh-CN"]: {
    ...zhCN,
  },
  ["en-US"]: {
    ...enUS,
  },
  ["zh-TW"]: {
    ...zhTW,
  },
};

let i18n;

const loadedLanguages = [defaultLang];

export function setI18nLanguage(localLang) {
  const lang = getStandLang(localLang);
  if (i18n.mode === "legacy") {
    i18n.global.locale = lang;
  } else {
    i18n.global.locale.value = lang;
  }
  loadedLanguages.push();
  // axios.defaults.headers.common['Accept-Language'] = locale
  document.querySelector("html")?.setAttribute("lang", lang);
  return lang;
}

export function loadLanguageAsync(localLang = defaultLang) {
  const lang = getStandLang(localLang);
  return new Promise((resolve) => {
    // 缓存语言设置
    storage.set("lang", lang);
    if (i18n.global.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(`./lang/${lang}.ts`).then((msg) => {
          const message = msg.default;
          i18n.global.setLocaleMessage(lang, message);
          loadedLanguages.push(lang);
          // console.log(message);
          return setI18nLanguage(lang);
        });
      }
      return resolve(setI18nLanguage(lang));
    }
    return resolve(lang);
  });
}

export async function setupI18n(app: App) {
  if (!i18n) {
    i18n = createI18n({
      globalInjection: true,
      legacy: false,
      silentTranslationWarn: true,
      locale: defaultLang,
      fallbackLocale: defaultLang,
      messages,
    });
  }
  app.use(i18n);
}

export function t(key) {
  return i18n.global.t(`${key}`);
}

export function getAntLocale(localLang) {
  const lang = getStandLang(localLang);
  return i18n.global.getLocaleMessage(lang).antLocale;
}

export default i18n;
