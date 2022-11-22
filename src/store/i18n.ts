import { computed } from "vue";
import { useAppStore } from "@/store/modules/app";

const app = useAppStore();

export const currentLang = computed(() => app.lang);
export const setLang = (lang) => {
  app.setLang(lang).then(() => {});
};

export default { currentLang, setLang };
