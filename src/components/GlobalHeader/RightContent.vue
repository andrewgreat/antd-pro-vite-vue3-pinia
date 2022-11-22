<template>
  <div :style="{ margin: '0 8px', fontSize: '16px' }" :class="wrpCls">
    <avatar-dropdown :current-user="currentUser" :class="prefixCls" />
  </div>
  <div
    :style="{ display: 'flex', margin: '0 8px', fontSize: '20px' }"
    :class="wrpCls"
  >
    <select-lang :class="prefixCls" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive, UnwrapRef } from "vue";
import AvatarDropdown from "./AvatarDropdown.vue";
import SelectLang from "@/components/SelectLang";
// import storage from 'store';
import { useUserStore } from "@/store/modules/user";

export default defineComponent({
  name: "RightContent",
  components: {
    AvatarDropdown,
    SelectLang,
  },
  props: {
    prefixCls: {
      type: String,
      default: "ant-pro-global-header-index-action",
    },
    isMobile: {
      type: Boolean,
      default: () => false,
    },
    topMenu: {
      type: Boolean,
      required: false,
    },
    theme: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const currentUser: UnwrapRef<{ [p: string]: any }> = reactive({
      name: String,
    });
    const userStore = useUserStore();
    const wrpCls = computed(() => {
      return {
        "ant-pro-global-header-index-right": true,
        [`ant-pro-global-header-index-${
          props.isMobile || !props.topMenu ? "light" : props.theme
        }`]: true,
      };
    });

    onMounted(() => {
      setTimeout(() => {
        currentUser.name = "" || userStore.nickname;
      }, 1000);
    });

    return {
      wrpCls,
      currentUser,
    };
  },
});
</script>

<style lang="less" scoped></style>
