import { computed } from "vue";
import { useAppStore } from "@/store/modules/app";

export const currentLang = computed(() => {
  console.log("i18n...")
  const appStore = useAppStore();
 return appStore.lang;
});
export const setLang = (lang) => {
  const appStore = useAppStore();
  appStore.setLang(lang).then(() => {});
};

export default { currentLang, setLang };
