// import { defineConfig } from 'vite'
import { UserConfigExport, ConfigEnv } from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteSvgIcons from 'vite-plugin-svg-icons'
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { viteThemePlugin } from 'vite-plugin-theme';
import { viteMockServe } from "vite-plugin-mock"

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport =>{
  let prodMock = true
  return {
    define: {
      'process.env': {},
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: '@',
          replacement: resolve(__dirname, './src')
        },
        { find: /^~/, replacement: '' }
      ]
    },
    server: {
      proxy: {
        // 选项写法
        '/api': {
          target: 'http://localhost:3000', // 所要代理的目标地址
          rewrite: path => path.replace(/^\/api/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
          changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
        },
        '/v2':{
          target: 'https://www.mocky.io',
          changeOrigin: true
        }
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
          modifyVars: getThemeVariables(),
          // modifyVars: {
          //   hack: `true; @import 'ant-design-vue/dist/antd.less'`, // antd.dark.less
          // }
        },
      },
      postcss: {}
    },
    plugins: [
      vue(),
      vueJsx(),
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[name]',
      }),
      viteThemePlugin({
        // 匹配需要修改的颜色
         colorVariables: [],
      }),
      viteMockServe({
        mockPath: "./mock",
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && prodMock,
        injectCode: `
          import { setupProdMockServer } from './mock/mockProdServer';
          setupProdMockServer();
        `,
      }),
    ]
  }
}

