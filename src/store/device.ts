import { computed } from "vue";
import { useAppStore } from "@/store/modules/app";

export const isMobile = computed(() => useAppStore().isMobile);
export default { isMobile };
