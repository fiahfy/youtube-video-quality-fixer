import browser from 'webextension-polyfill'

const videoReady = () => {
  return new Promise((resolve) => {
    const timeout = Date.now() + 3000
    const timer = setInterval(() => {
      const video = document.querySelector('video.html5-main-video')
      if ((video && video.readyState === 4) || Date.now() > timeout) {
        clearInterval(timer)
        resolve()
      }
    }, 100)
  })
}

browser.runtime.onMessage.addListener((message) => {
  const { id, type } = message
  if (type === 'SIGN_RELOAD' && process.env.NODE_ENV !== 'production') {
    parent.location.reload()
    return
  }
  switch (id) {
    case 'urlChanged':
      setupControlButtons()
      break
  }
})

document.addEventListener('DOMContentLoaded', () => {
  setupControlButtons()
})
