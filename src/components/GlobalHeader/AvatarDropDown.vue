<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <template #overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <template #icon>
            <SettingOutlined />
          </template>
          <span> {{ $t("menu.account.center") }}</span>
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <template #icon>
            <SettingOutlined />
          </template>
          <span>{{ $t("menu.account.settings") }}</span>
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <template #icon>
            <LogoutOutlined />
          </template>
          <span>{{ $t("menu.account.logout") }}</span>
        </a-menu-item>
      </a-menu>
    </template>
    <span class="ant-pro-account-avatar">
      <a-avatar
        shape="square"
        size="small"
        src="/src/assets/images/avatar2.jpg"
        class="antd-pro-global-header-index-avatar"
      >
      </a-avatar>
      <span>{{ currentUser.name }}</span>
    </span>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal } from "ant-design-vue";
import { useI18n } from "vue-i18n";
// import { useStore } from 'vuex';
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AvatarDropDown",
  props: {
    currentUser: {
      type: Object,
      "{[p: string]: any}": () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const userStore = useUserStore();

    const handleToCenter = () => {
      // console.log('handleToCenter')
      router.push({ path: "/account/center" });
    };
    const handleToSettings = () => {
      router.push({ path: "/account/settings" });
    };

    const handleLogout = () => {
      Modal.confirm({
        title: t("layouts.usermenu.dialog.title"),
        content: t("layouts.usermenu.dialog.content"),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return userStore.Logout().then(() => {
            router.push({ name: "login" });
          });
        },
      });
    };
    return {
      handleToCenter,
      handleToSettings,
      handleLogout,
    };
  },
});
</script>

<style lang="less" scoped></style>
