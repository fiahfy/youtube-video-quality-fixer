import browser from 'webextension-polyfill'
import className from './constants/class-name'

let timer = null
let oldSrc = null

const waitVideoReady = () => {
  clearInterval(timer)

  return new Promise((resolve) => {
    const timeout = Date.now() + 10000
    timer = setInterval(() => {
      const video = document.querySelector('video.html5-main-video')
      if (video && video.currentSrc !== oldSrc && video.readyState === 4) {
        clearInterval(timer)
        oldSrc = video.currentSrc
        resolve(true)
      } else if (Date.now() > timeout) {
        clearInterval(timer)
        resolve(false)
      }
    })
  })
}

const waitSubmenuShown = (text) => {
  clearInterval(timer)

  return new Promise((resolve) => {
    const timeout = Date.now() + 3000
    timer = setInterval(() => {
      const subMenu = document.querySelector(
        '.ytp-settings-menu .ytp-menuitem:last-child'
      )
      if (text !== subMenu.textContent) {
        clearInterval(timer)
        resolve(true)
      } else if (Date.now() > timeout) {
        clearInterval(timer)
        resolve(false)
      }
    })
  })
}

const fixVideoQuality = async () => {
  await waitVideoReady()

  document.body.classList.add(className.fixing)

  try {
    const button = document.querySelector('.ytp-settings-button')
    button.click()

    const menu = document.querySelector(
      '.ytp-settings-menu .ytp-menuitem:last-child'
    )
    const text = menu.textContent
    if (!text.match(/\d+p/)) {
      throw new Error('Invalid menu item')
    }
    menu.click()

    const shown = await waitSubmenuShown(text)
    if (!shown) {
      throw new Error('Sub menu not shown')
    }

    const submenu = document.querySelector(
      '.ytp-settings-menu .ytp-menuitem:first-child'
    )
    submenu.click()
  } catch (e) {
    //
  } finally {
    document.body.classList.remove(className.fixing)
  }
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, type } = message
  if (type === 'SIGN_RELOAD' && process.env.NODE_ENV !== 'production') {
    parent.location.reload()
    return
  }
  switch (id) {
    case 'urlChanged':
      await fixVideoQuality()
      break
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  await browser.runtime.sendMessage({ id: 'contentLoaded' })
  await fixVideoQuality()
})
