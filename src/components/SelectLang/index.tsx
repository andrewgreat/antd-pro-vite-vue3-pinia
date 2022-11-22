import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n'
import i18n from '@/store/i18n'

export default defineComponent({
  name: 'SelectLang',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    }
  },
  setup(props) {
    const { t } = useI18n()
    const locales = ['zhCN', 'zhTW', 'enUS', 'ptBR']
    const languageLabels = {
      'zhCN': '简体中文',
      'zhTW': '繁體中文',
      'enUS': 'English',
      'ptBR': 'Português'
    }

    const languageIcons = {
      'zhCN': '🇨🇳',
      'zhTW': '🇭🇰',
      'enUS': '🇺🇸',
      'ptBR': '🇧🇷'
    }

    const { currentLang, setLang } = i18n
    const render = () => {
      const { prefixCls } = props
      const changeLang = ({ key }) => {
        setLang(key)
      }
      const langMenu = (
        <a-menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[currentLang]} onClick={changeLang}>
          {locales.map(locale => (
            <a-menu-item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}{' '}
            </span>
              {languageLabels[locale]}
            </a-menu-item>
          ))}
        </a-menu>
      )
      return (
        <a-dropdown overlay={langMenu} placement="bottomRight">
          <a-tooltip title={t('navBar.lang')}>
            <span class={prefixCls}>
              <global-outlined />
            </span>
          </a-tooltip>
        </a-dropdown>
      )
    }
    return () => render()
  }
});
