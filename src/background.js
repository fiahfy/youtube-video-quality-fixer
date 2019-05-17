import browser from 'webextension-polyfill'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, { id: 'urlChanged' })
  }
})
