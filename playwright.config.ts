import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './testing',
  maxFailures: 2,


  webServer: {
    command: 'node testing_linkencoder_scripts/fake-link.js',
    port: 10002
    //url: 'http://localhost:10002',
    //reuseExistingServer: false
  },
}

export default config