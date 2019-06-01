import browser from 'webextension-polyfill'
import className from './constants/class-name'

let timer = null
let oldSrc = null

const waitVideoReady = () => {
  clearInterval(timer)

  return new Promise((resolve, reject) => {
    const timeout = Date.now() + 10000
    timer = setInterval(() => {
      const video = document.querySelector('video.html5-main-video')
      if (video && video.currentSrc !== oldSrc) {
        clearInterval(timer)
        oldSrc = video.currentSrc
        resolve(video.readyState !== 0)
      } else if (Date.now() > timeout) {
        clearInterval(timer)
        reject('timeout')
      }
    })
  })
}

const waitSubmenuShown = (text) => {
  clearInterval(timer)

  return new Promise((resolve, reject) => {
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
        reject('timeout')
      }
    })
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

    await waitSubmenuShown(text)

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
    const video = document.querySelector('video.html5-main-video')
    video && video.removeEventListener('loadeddata', fixQuality)

    const ready = await waitVideoReady()
    if (!ready) {
      const video = document.querySelector('video.html5-main-video')
      video && video.addEventListener('loadeddata', fixQuality)
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
