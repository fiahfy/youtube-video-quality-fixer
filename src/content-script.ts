import { browser } from 'webextension-polyfill-ts'
import className from './constants/class-name'

let timer = -1
const interval = 100
const timeout = 3000

const getQualityMenuItem = (): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const expire = Date.now() + 3000
    const timer = setInterval(() => {
      const menu = document.querySelector(
        '.ytp-settings-menu .ytp-menuitem:last-child'
      ) as HTMLElement | null
      const text = menu?.textContent ?? ''
      if (text.match(/\d+p/)) {
        clearInterval(timer)
        resolve(menu)
      } else if (Date.now() > expire) {
        clearInterval(timer)
        resolve(null)
      }
    }, 100)
  })
}

const getHighestQualityMenuItem = (): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const expire = Date.now() + 3000
    const timer = setInterval(() => {
      const menu = document.querySelector(
        '.ytp-settings-menu .ytp-menuitem:first-child'
      ) as HTMLElement | null
      const text = menu?.textContent ?? ''
      if (text.match(/\d+p/)) {
        clearInterval(timer)
        resolve(menu)
      } else if (Date.now() > expire) {
        clearInterval(timer)
        resolve(null)
      }
    }, 100)
  })
}

const fixQuality = async (): Promise<boolean> => {
  try {
    document.body.classList.add(className.fixing)

    const button = document.querySelector(
      '.ytp-settings-button'
    ) as HTMLElement | null
    if (!button) {
      throw new Error('Settings button not found')
    }
    button.click()

    const menu = await getQualityMenuItem()
    if (!menu) {
      throw new Error('Menu not found')
    }
    menu.click()

    const submenu = await getHighestQualityMenuItem()
    if (!submenu) {
      throw new Error('Submenu not found')
    }
    submenu.click()
    return true
  } catch (e) {
    return false
  } finally {
    document.body.classList.remove(className.fixing)
  }
}

const fixQualityLoop = async (): Promise<void> => {
  return new Promise((resolve) => {
    const video = document.querySelector('video.html5-main-video')
    if (video) {
      video.removeEventListener('loadedmetadata', fixQualityLoop)
    }

    if (timer) {
      clearTimeout(timer)
    }

    const expire = Date.now() + timeout
    const callback = async (): Promise<void> => {
      if (Date.now() > expire) {
        clearTimeout(timer)
        resolve()
        return
      }
      const result = await fixQuality()
      if (result) {
        clearTimeout(timer)
        resolve()
        return
      }
      timer = setTimeout(callback)
    }
    timer = setTimeout(callback, interval)
  })
}

const setup = async (): Promise<void> => {
  await fixQualityLoop()

  const video = document.querySelector(
    'video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video || video.readyState > 0) {
    return
  }
  video.addEventListener('loadedmetadata', fixQualityLoop)
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id } = message
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
