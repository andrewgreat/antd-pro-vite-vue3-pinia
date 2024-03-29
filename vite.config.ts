// import { defineConfig } from 'vite'
import { UserConfigExport, ConfigEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import Less2CssVariablePlugin from "antd-less-to-css-variable";
import { getThemeVariables } from "ant-design-vue/dist/theme";
import { viteMockServe } from "vite-plugin-mock";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  const { resolve } = path;
  let prodMock = true;
  return {
    define: {
      "process.env": {},
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    resolve: {
      alias: [
        {
          find: "vue-i18n",
          replacement: "vue-i18n/dist/vue-i18n.cjs.js",
        },
        {
          find: /^@\//,
          replacement: resolve(__dirname, "./src") + "/",
        },
        { find: /^~/, replacement: "" },
      ],
    },
    server: {
      proxy: {
        // 选项写法
        "/api": {
          target: "http://localhost:3000", // 所要代理的目标地址
          rewrite: (path) => path.replace(/^\/api/, ""), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
          changeOrigin: true, // true/false, Default: false - changes the origin of the host header to the target URL
        },
      },
      // hmr: {
      //   overlay: false
      // }
    },
    css: {
      preprocessorOptions: {
        less: {
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
          plugins: [new Less2CssVariablePlugin()],
          modifyVars: getThemeVariables(),
          // modifyVars: {
          //   hack: `true; @import 'ant-design-vue/dist/antd.less'`, // antd.dark.less
          // }
        },
      },
      postcss: {},
    },
    plugins: [
      vue(),
      vueJsx(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(__dirname, "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[name]",
      }),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: false})],
      }),
      viteMockServe({
        mockPath: "./mock",
        localEnabled: command === "serve",
        prodEnabled: command !== "serve" && prodMock,
        injectCode: `
          import { setupProdMockServer } from './mock/mockProdServer';
          setupProdMockServer();
        `,
      }),
    ],
  };
};
