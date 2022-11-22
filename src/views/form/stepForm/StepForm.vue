<template>
  <page-header-wrapper>
    <!-- PageHeader 第二种使用方式 (v-slot) -->
    <template v-slot:content>
      将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。
    </template>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="填写转账信息" />
        <a-step title="确认转账信息" />
        <a-step title="完成" />
      </a-steps>
      <div class="content">
        <step1 v-if="currentTab === 0" @nextStep="nextStep"/>
        <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
        <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'

export default defineComponent({
  name: 'StepForm',
  components: {
    Step1,
    Step2,
    Step3
  },
  setup () {
    const currentTab = ref(0)
      // form
    const  form = null

    // handler
   function nextStep () {
      if (currentTab.value < 2) {
        console.log('stepform:','next')
        currentTab.value += 1
      }
    }
    function prevStep () {
      if (currentTab.value > 0) {
        currentTab.value -= 1
      }
    }
    function finish () {
      currentTab.value = 0
    }

    return {
      currentTab,
      // form
      form,
      nextStep,
      prevStep,
      finish
    }
  }
})
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
