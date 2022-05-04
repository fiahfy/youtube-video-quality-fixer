import { Settings } from '~/models'

const className = 'yvqf-video-quality-fixing'
const interval = 100
const timeout = 3000
let timer = -1
let settings: Settings

const isVideoUrl = () => new URL(location.href).pathname === '/watch'

const getQualityMenuItem = (): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const expire = Date.now() + timeout
    const timer = window.setInterval(() => {
      const menu = document.querySelector(
        '.ytp-settings-menu .ytp-menuitem:last-child'
      ) as HTMLElement | null
      const text = menu?.textContent ?? ''
      if (text.match(/\d+p/)) {
        window.clearInterval(timer)
        resolve(menu)
      } else if (Date.now() > expire) {
        window.clearInterval(timer)
        resolve(null)
      }
    }, 100)
  })
}

const getQualityMenuItems = (): Promise<HTMLElement[]> => {
  return new Promise((resolve) => {
    const expire = Date.now() + timeout
    const timer = window.setInterval(() => {
      const menus = Array.from(
        document.querySelectorAll('.ytp-settings-menu .ytp-menuitem')
      ) as HTMLElement[]
      if (menus.length) {
        window.clearInterval(timer)
        resolve(menus)
      } else if (Date.now() > expire) {
        window.clearInterval(timer)
        resolve([])
      }
    }, 100)
  })
}

const fixQuality = async (): Promise<boolean> => {
  try {
    if (settings.quality === 'auto') {
      return true
    }

    document.body.classList.add(className)

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

    const menus = await getQualityMenuItems()
    if (!menus.length) {
      throw new Error('Submenu not found')
    }

    const qualities = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320].filter(
      (quality) => quality <= settings.quality
    )

    const submenu = menus.find((menu) => {
      const quality = Number((menu?.textContent ?? '').split('p')[0])
      return qualities.includes(quality)
    })
    if (!submenu) {
      throw new Error('Submenu not match')
    }
    submenu.click()
    return true
  } catch (e) {
    return false
  } finally {
    document.body.classList.remove(className)
  }
}

const fixQualityLoop = async (): Promise<void> => {
  return new Promise((resolve) => {
    const video = document.querySelector(
      'ytd-watch-flexy video.html5-main-video'
    )
    if (video) {
      video.removeEventListener('loadedmetadata', fixQualityLoop)
    }

    if (timer) {
      window.clearTimeout(timer)
    }

    const expire = Date.now() + timeout
    const callback = async (): Promise<void> => {
      if (Date.now() > expire) {
        window.clearTimeout(timer)
        resolve()
        return
      }
      const result = await fixQuality()
      if (result) {
        window.clearTimeout(timer)
        resolve()
        return
      }
      timer = window.setTimeout(callback)
    }
    timer = window.setTimeout(callback, interval)
  })
}

const init = async (): Promise<void> => {
  if (!isVideoUrl()) {
    return
  }

  await fixQualityLoop()

  const video = document.querySelector(
    'ytd-watch-flexy video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video || video.readyState > 0) {
    return
  }
  video.addEventListener('loadedmetadata', fixQualityLoop)
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type } = message
  switch (type) {
    case 'url-changed':
      init().then(() => sendResponse())
      return true
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.runtime.sendMessage({ type: 'content-loaded' })
  settings = data.settings
  await init()
})
