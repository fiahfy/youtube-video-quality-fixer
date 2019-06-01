import browser from 'webextension-polyfill'
import className from './constants/class-name'

let timer = null
let oldSrc = null

const waitVideoSrcChanged = () => {
  return new Promise((resolve) => {
    clearInterval(timer)

    const timeout = Date.now() + 3000
    timer = setInterval(() => {
      const video = document.querySelector('video.html5-main-video')
      if (video && video.currentSrc && video.currentSrc !== oldSrc) {
        clearInterval(timer)
        oldSrc = video.currentSrc
        resolve(true)
      } else if (Date.now() > timeout) {
        clearInterval(timer)
        resolve(false)
      }
    }, 100)
  })
}

const waitVideoLoaded = () => {
  return new Promise((resolve) => {
    const video = document.querySelector('video.html5-main-video')
    if (!video) {
      return resolve(false)
    }
    if (video.readyState > 0) {
      return resolve(true)
    }
    const callback = () => {
      video.removeEventListener('loadedmetadata', callback)
      resolve(true)
    }
    video.addEventListener('loadedmetadata', callback)
  })
}

const waitSubmenuShown = (text) => {
  return new Promise((resolve) => {
    clearInterval(timer)

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
    }, 100)
  })
}

const fixQuality = async () => {
  try {
    document.body.classList.add(className.fixing)

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
      throw new Error('Timeout')
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

const setup = async () => {
  try {
    const changed = await waitVideoSrcChanged()
    if (!changed) {
      return
    }
    const loaded = await waitVideoLoaded()
    if (!loaded) {
      return
    }

    fixQuality()
  } catch (e) {} // eslint-disable-line no-empty
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, type } = message
  if (type === 'SIGN_RELOAD' && process.env.NODE_ENV !== 'production') {
    parent.location.reload()
    return
  }
  switch (id) {
    case 'urlChanged':
      await setup()
      break
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  await browser.runtime.sendMessage({ id: 'contentLoaded' })
  await setup()
})
