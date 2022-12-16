<template>
  <a-drawer
    v-model:visible="visible"
    :width="300"
    placement="right"
    :closable="false"
  >
    <template #handle>
      <div class="ant-setting-drawer-handle" @click="handleShowDrawer">
        <SettingOutlined v-if="!visible" />
        <CloseOutlined v-else />
      </div>
    </template>
    <div class="setting-drawer-index-content">
      <h3 class="setting-drawer-index-title">整体风格设置</h3>
      <div class="setting-drawer-index-blockChecbox">
        <a-tooltip
          v-for="(item, index) in themeList"
          :key="index"
          placement="top"
        >
          <template #title>
            <span>{{ item.tips }}</span>
          </template>
          <div
            class="setting-drawer-index-item"
            @click="handleMenuTheme(item.value)"
          >
            <img :src="item.image" :alt="item.value" />
            <check-outlined
              v-if="modelValue.navTheme === item.value"
              class="setting-drawer-index-selectIcon"
            />
          </div>
        </a-tooltip>
      </div>

      <div class="setting-drawer-index-item">
        <h3 class="setting-drawer-index-title">主题色</h3>
        <div style="height: 20px">
          <a-tooltip
            class="setting-drawer-theme-color-colorBlock"
            v-for="(item, index) in colorList"
            :key="index"
          >
            <template #title>{{ item.key }}</template>
            <a-tag
              :color="item.color"
              @click="changeColor(item.color, 'primaryColor')"
            >
              <CheckOutlined
                v-if="modelValue.theme.primaryColor === item.color"
              />
            </a-tag>
          </a-tooltip>
          <!-- 自定义颜色 todo...-->
        </div>
      </div>
      <a-divider />
      <h3 class="setting-drawer-index-title">导航模式</h3>
      <div class="setting-drawer-index-blockChecbox">
        <a-tooltip
          v-for="(item, index) in layoutList"
          :key="index"
          placement="top"
        >
          <template #title>
            <span>{{ item.tips }}</span>
          </template>
          <div
            class="setting-drawer-index-item"
            @click="handleLayout(item.value)"
          >
            <img :src="item.image" :alt="item.value" />
            <check-outlined
              v-if="modelValue.layout === item.value"
              class="setting-drawer-index-selectIcon"
            />
          </div>
        </a-tooltip>
      </div>
      <div :style="{ marginTop: '24px' }">
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">内容区域宽度</a-col>
          <a-col :span="12" style="text-align: right">
            <a-tooltip>
              <template #title> 该设定仅 [顶部栏导航] 时有效 </template>
              <a-select
                size="small"
                style="width: 80px"
                :value="modelValue.contentWidth"
                @change="contentWidthChange"
              >
                <a-select-option value="Fixed">固定</a-select-option>
                <a-select-option
                  value="Fluid"
                  v-if="modelValue.layout !== 'side'"
                  >流式</a-select-option
                >
              </a-select>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">固定 Header</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="modelValue.fixedHeader"
              @change="handleFixedHeader"
            />
          </a-col>
        </a-row>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">固定 左侧菜单</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :disabled="modelValue.layout === 'top'"
              :checked="modelValue.fixSiderbar"
              @change="handleFixSiderbar"
            />
          </a-col>
        </a-row>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">自动分割菜单</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="modelValue.splitMenus"
              @change="handleSplitMenus"
            />
          </a-col>
        </a-row>
      </div>
      <a-divider />
      <div class="margin-bottom: 24px">
        <h3>内容区域</h3>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">顶栏</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="modelValue.headerRender === undefined"
              @change="(checked: CheckedType) => updateConf(checked === true && undefined, 'headerRender')"
            />
          </a-col>
        </a-row>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">页脚</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="modelValue.footerRender === undefined"
              @change="(checked: CheckedType) => updateConf(checked === true && undefined, 'footerRender')"
            />
          </a-col>
        </a-row>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">菜单</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              disabled
              checked-children="开"
              un-checked-children="关"
              :checked="modelValue.menu === undefined"
              @change="(checked: CheckedType) => updateConf(checked === true && undefined, 'menu')"
            />
          </a-col>
        </a-row>
        <a-row style="margin-bottom: 12px">
          <a-col :span="12">菜单头</a-col>
          <a-col :span="12" style="text-align: right">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="modelValue.menuHeaderRender === undefined"
              @change="(checked: CheckedType) => updateConf(checked === true && undefined, 'menuHeaderRender')"
            />
          </a-col>
        </a-row>
      </div>
    </div>
    <a-divider />
    <div :style="{ marginBottom: '24px' }">
      <a-alert
        message=""
        description="配置栏只在开发环境用于预览，生产环境不会展现，请手动修改配置文件"
        type="warning"
        show-icon
      >
        <template #icon><sound-outlined /></template>
      </a-alert>
      <a-button @click="doCopy" block :style="{ marginTop: '24px' }">
        <template #icon>
          <CopyOutlined />
        </template>
        拷贝设置
      </a-button>
    </div>
  </a-drawer>
</template>

<script setup name="SettingDrawer" lang="ts">
import { ref, toRaw } from "vue";
import { useAppStore } from "@/store/modules/app";
import { message } from "ant-design-vue";
import useClipboard from "vue-clipboard3";
import colorConfig from "@/config/colorConfig";
// import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils.js";
import { changeTheme } from "@/utils/theme";

type CheckedType = boolean | string | number;
type ConfType = "layout" | "fixedHeader" | "fixSiderbar" | string;

const appStore = useAppStore();
const { toClipboard } = useClipboard();

const props = defineProps<{
  modelValue: Record<string, any>;
}>();
const emit = defineEmits(["update:modelValue"]);

// 整体风格
const themeList = [
  {
    tips: "暗色主题风格",
    value: "dark",
    image: "/images/dark.svg",
  },
  {
    tips: "亮色主题风格",
    value: "light",
    image: "/images/light.svg",
  },
  {
    tips: "暗黑模式",
    value: "realDark",
    image: "/images/realDark.svg",
  },
];

//主题色
const { colorList } = colorConfig;

const layoutList = [
  {
    tips: "侧边栏导航",
    value: "side",
    image: "/images/sidemenu.svg",
  },
  {
    tips: "顶部栏导航",
    value: "top",
    image: "/images/topmenu.svg",
  },
  {
    tips: "混合菜单布局",
    value: "mix",
    image: "/images/mixmenu.svg",
  },
];

const themes = ref({
  primaryColor: appStore.theme.primaryColor,
});

const visible = ref<boolean>(false);
const handleShowDrawer = () => {
  visible.value = !visible.value;
};

const updateConf = (val: any, type: ConfType) => {
  const newVal = {
    ...toRaw(props.modelValue),
    [`${type}`]: val,
  };
  console.log("newConf", newVal);
  emit("update:modelValue", newVal);
};

const updateConfs = (vals: {}) => {
  const newVal = {
    ...toRaw(props.modelValue),
    ...vals,
  };
  console.log("newConf", newVal);
  emit("update:modelValue", newVal);
};

const handleMenuTheme = (theme: string) => {
  updateConf(theme, "navTheme");
  appStore.navTheme = theme;
};

const changeColor = (color: string, themeType: string) => {
  themes.value.primaryColor = color;
  changeTheme(themes.value);
  const newVal = {
    ...toRaw(props.modelValue),
    theme: {
      [`${themeType}`]: color,
    },
  };
  // console.log("newConf", newVal);
  emit("update:modelValue", newVal);
  appStore.theme.primaryColor = color;
};

const handleLayout = (layout: string) => {
  let configs = {
    ["layout"]: layout,
    ["fixSiderbar"]: props.modelValue.fixSiderbar,
  };
  if (layout === "top") {
    configs.fixSiderbar = false;
  }
  updateConfs(configs);
  appStore.layout = layout;
  appStore.fixSiderbar = configs.fixSiderbar;
};

const contentWidthChange = (type) => {
  updateConf(type, "contentWidth");
  appStore.contentWidth = type;
};

const handleFixedHeader = (fixed: boolean) => {
  updateConf(fixed, "fixedHeader");
  appStore.fixedHeader = fixed;
};

const handleFixSiderbar = (fixed: boolean) => {
  let fixSiderbar: boolean = fixed;
  if (props.modelValue.layout === "top") {
    fixSiderbar = false;
  }
  updateConf(fixSiderbar, "fixSiderbar");
  appStore.fixSiderbar = fixed;
};
const handleSplitMenus = (split: boolean) => {
  updateConf(split, "splitMenus");
  appStore.splitMenus = split;
};

const doCopy = () => {
  // get current settings from mixin or this.$store.state.app, pay attention to the property name
  const text = `export default {
  primaryColor: '${props.modelValue.primaryColor}', // primary color of ant design
  navTheme: '${props.modelValue.navTheme}', // theme for nav menu
  layout: '${props.modelValue.layout}', // nav menu position: sidemenu or topmenu
  contentWidth: '${props.modelValue.contentWidth}', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: ${props.modelValue.fixedHeader}, // sticky header
  fixSiderbar: ${props.modelValue.fixSiderbar}, // sticky siderbar
  colorWeak: ${props.modelValue.colorWeak},
  // multiTab: {multiTab},
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}`;
  toClipboard(text)
    .then((msg) => {
      console.log("copy", msg);
      message.success("拷贝设置成功 src/config/defaultSettings.js");
    })
    .catch((err) => {
      console.log("copy.err", err);
      message.error("复制失败");
    });
};
</script>

<style lang="less">
@import "ant-design-vue/dist/antd.variable.less";
.ant-setting-drawer-handle {
  position: absolute;
  top: 240px;
  right: 300px;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 16px;
  text-align: center;
  background: @primary-color;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  pointer-events: auto;

  > span {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}

.setting-drawer-index-content {
  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }

  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}
</style>
