import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly
// You can use the import.meta.glob function to import all
import userModule from './services/user'
import authModule from './services/auth'
import articleModule from './services/article'
import manageModule from './services/manage'
import otherModule from './services/other'
import tagCloudModule from './services/tagCloud'

export function setupProdMockServer() {
  createProdMockServer([
    ...userModule,
    ...authModule,
    ...articleModule,
    ...manageModule,
    ...otherModule,
    ...tagCloudModule
  ])
}
