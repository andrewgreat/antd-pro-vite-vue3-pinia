<template>
  <a-result
    :isSuccess="true"
    :content="false"
    :title="email"
    :sub-title="description">

    <template #extra>
      <a-button size="large" type="primary">查看邮箱</a-button>
      <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">返回首页</a-button>
    </template>

  </a-result>
</template>

<script lang="ts">
import {defineComponent, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'RegisterResult',
  setup(){
    const  description='激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。'
    const route = useRoute()
    const router = useRouter()
    //created
    const form = reactive(route.params)

    const email = computed(() =>{
      const v = form && form.email || 'xxx'
      return `你的账户：${v} 注册成功`
    })
   const  goHomeHandle = () => {
     router.push({ name: 'login' })
    }
    return{
      description,
      form,
      email,
      goHomeHandle
    }
  }
})

</script>

<style scoped>

</style>
