// import { defineConfig } from 'vite'
import { UserConfigExport, ConfigEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteSvgIcons from "vite-plugin-svg-icons";
import { getThemeVariables } from "ant-design-vue/dist/theme";
import {
  themePreprocessorPlugin,
  themePreprocessorHmrPlugin,
} from "@zougt/vite-plugin-theme-preprocessor";
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
      watch: {
        // themePreprocessorHmrPlugin 热更新时必需的，希望监听setCustomTheme.js
        ignored: ["!**/node_modules/**/setCustomTheme.js"],
      },
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
          // modifyVars: getThemeVariables(),
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
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(__dirname, "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[name]",
      }),
      Components({
        resolvers: [AntDesignVueResolver()],
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
      // 创建动态主题切换
      themePreprocessorPlugin({
        less: {
          // 启用任意主题色模式
          arbitraryMode: true,
          // 默认的主题色，用于对其他颜色值形成对比值，通常与 src/theme/theme-vars.less 中的一个主题色相同，也可以不相同，就看是不是你想要的效果
          defaultPrimaryColor: "#1890ff",
          // 只需提供一组变量文件
          multipleScopeVars: [
            {
              scopeName: "theme-default",
              path: path.resolve("src/style/theme/theme-vars.less"),
            },
          ],
          // css中不是由主题色变量生成的颜色，也让它抽取到主题css内，可以提高权重
          includeStyleWithColors: [
            {
              color: "#ffffff",
            },
            {
              color: ["transparent", "none"],
            },
          ],
        },
      }),
      themePreprocessorHmrPlugin(),
    ],
  };
};
