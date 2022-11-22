<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <template #renderItem="{item, index}">
      <a-list-item :key="index">
        <a-list-item-meta>
          <template #title>
            <a>{{ item.title }}</a>
          </template>
          <template #description>
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </template>
        </a-list-item-meta>
        <template v-if="item.actions" #actions>
          <a @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>

      </a-list-item>
    </template>

  </a-list>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {message} from 'ant-design-vue'

export default defineComponent({
  name:'SecuritySettings',
  setup(){
    const {t} = useI18n()
    const data = computed(() => {
      return [
        { title: t('account.settings.security.password'), description: t('account.settings.security.password-description'), value: '强', actions: { title: t('account.settings.security.modify'), callback: () => { message.info('This is a normal message') } } },
        { title: t('account.settings.security.phone'), description: t('account.settings.security.phone-description'), value: '138****8293', actions: { title: t('account.settings.security.modify'), callback: () => { message.success('This is a message of success') } } },
        { title: t('account.settings.security.question'), description: t('account.settings.security.question-description'), value: '', actions: { title: t('account.settings.security.set'), callback: () => { message.error('This is a message of error') } } },
        { title: t('account.settings.security.email'), description: t('account.settings.security.email-description'), value: 'ant***sign.com', actions: { title: t('account.settings.security.modify'), callback: () => { message.warning('This is message of warning') } } },
        { title: t('account.settings.security.mfa'), description: t('account.settings.security.mfa-description'), value: '', actions: { title: t('account.settings.security.bind'), callback: () => { message.info('This is a normal message') } } }
      ]
    })
    return{
      data
    }
  }
})
</script>

<style scoped>

</style>
