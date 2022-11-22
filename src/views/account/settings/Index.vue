<template>
  <div class="page-header-index-wide">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="account-settings-info-main" :class="{ 'mobile': isMobile }">
        <div class="account-settings-info-left">
          <a-menu
            :mode="isMobile ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: isMobile ? '560px' : 'auto'}"
            :selectedKeys="selectedKeys"
            v-model:openKeys="openKeys"
            type="inner"
            @openChange="onOpenChange"
          >
            <a-menu-item key="/account/settings/basic">
              <router-link :to="{ name: 'BasicSettings' }">
                {{ $t('account.settings.menuMap.basic') }}
              </router-link>
            </a-menu-item>
            <a-menu-item key="/account/settings/security">
              <router-link :to="{ name: 'SecuritySettings' }">
                {{ $t('account.settings.menuMap.security') }}
              </router-link>
            </a-menu-item>
            <a-menu-item key="/account/settings/custom">
              <router-link :to="{ name: 'CustomSettings' }">
                {{ $t('account.settings.menuMap.custom') }}
              </router-link>
            </a-menu-item>
            <a-menu-item key="/account/settings/binding">
              <router-link :to="{ name: 'BindingSettings' }">
                {{ $t('account.settings.menuMap.binding') }}
              </router-link>
            </a-menu-item>
            <a-menu-item key="/account/settings/notification">
              <router-link :to="{ name: 'NotificationSettings' }">
                {{ $t('account.settings.menuMap.notification') }}
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            <span>{{ $t(route.meta.title) }}</span>
          </div>
          <route-view></route-view>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch } from 'vue';
import {RouteLocationMatched, useRoute} from 'vue-router';
import RouteView from '@/layouts/RouteView.vue'
import {appBase} from '@/store/app-base'

export default defineComponent({
  name: 'Settings',
  components: {
    RouteView
  },
  setup(){
    const route = useRoute()
    const isMobile = ref(appBase.isMobile)
    // horizontal  inline
    const mode = ref('inline')
    const  openKeys = ref([])
    const  selectedKeys = ref(<String[]|undefined>[])
    // cropper
    const  preview = {}
    const option = {
      img: '/avatar2.jpg',
      info: true,
      size: 1,
      outputType: 'jpeg',
      canScale: false,
      autoCrop: true,
      // 只有自动截图开启 宽度高度才生效
      autoCropWidth: 180,
      autoCropHeight: 180,
      fixedBox: true,
      // 开启宽度和高度比例
      fixed: true,
      fixedNumber: [1, 1]
    }
    const pageTitle = ''

    const onOpenChange = (keys) => {
      console.log('keys',keys)
      openKeys.value = keys
    }
    const updateMenu = () => {
      const routes: RouteLocationMatched[] = route.matched.concat()
      const localRoute =(routes.pop()?.path)
      if (localRoute){
        selectedKeys.value = [localRoute]
      }
    }
    onMounted(()=>updateMenu())
    watch(route,() => updateMenu())

    return {
      route,
      isMobile,
      mode,
      openKeys,
      selectedKeys,
      preview,
      option,
      pageTitle,
      onOpenChange,
      updateMenu
    }
  }
})
</script>

<style lang="less" scoped>
  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
      display: block;

      .account-settings-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .account-settings-info-right {
        padding: 20px 40px;
      }
    }

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }

    .account-settings-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }

</style>
