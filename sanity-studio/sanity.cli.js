import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'wfwxz1rq',
    dataset: 'production'
  },
  vite: {
    base: '/admin/',
  },
})
