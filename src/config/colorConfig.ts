 import config from './defaultSettings';

// let lessNodesAppended
const colorList = [
  {
    key: '薄暮',
    color: '#F5222D'
  },
  {
    key: '火山',
    color: '#FA541C'
  },
  {
    key: '日暮',
    color: '#FAAD14'
  },
  {
    key: '明青',
    color: '#13C2C2'
  },
  {
    key: '极光绿',
    color: '#52C41A'
  },
  {
    key: '拂晓蓝（默认）',
    color: config.primaryColor
  },
  {
    key: '极客蓝',
    color: '#2F54EB'
  },
  {
    key: '酱紫',
    color: '#722ED1'
  }
]


// const updateTheme = newPrimaryColor => {
//   const hideMessage = message.loading('正在切换主题！', 0)
//   themeColor.changeColor(newPrimaryColor).finally(() => {
//     setTimeout(() => {
//       hideMessage()
//     }, 10)
//   })
// }

const updateDarkMode = isDark => {
  let styleTag = document.getElementById('themeCss')
  let appTag = document.getElementById('html')
  if (!styleTag) {
    styleTag = document.createElement('link')
    styleTag.setAttribute('id', 'themeCss')
    document.head.appendChild(styleTag)
  }
  if (isDark) {
    styleTag.setAttribute('href', '/themes/dark.css')
    appTag!.className = 'darkMode'
  }else{
    styleTag.setAttribute('href', '')
    appTag!.className = ''
  }
}

const updateColorWeak = isColorWeak => {
  const app = document.getElementById('html')
  isColorWeak ? app!.classList.add('colorWeak') : app!.classList.remove('colorWeak')
}

const updateGrayMode = isGrayMode => {
  const app = document.getElementById('html')
  isGrayMode ? app!.classList.add('grayMode') : app!.classList.remove('grayMode')
}

export  default { colorList, updateColorWeak, updateGrayMode, updateDarkMode }

