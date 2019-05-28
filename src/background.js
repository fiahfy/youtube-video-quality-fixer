import browser from 'webextension-polyfill'
import stylesheet from './constants/stylesheet'
import './assets/icon.png'

const injectCSS = async (tabId) => {
  await browser.tabs.insertCSS(tabId, { code: stylesheet })
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  const { id } = message
  const { tab } = sender
  switch (id) {
    case 'contentLoaded':
      return await injectCSS(tab.id)
  }
})

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, { id: 'urlChanged' })
  }
})
