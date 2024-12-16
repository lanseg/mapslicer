import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vite.config.js',
    test: {
      browser: {
        enabled: true,
        name: 'firefox',
        provider: 'webdriverio',
        // https://webdriver.io
        providerOptions: {},
      },
    },
  },
])
