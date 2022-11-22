<template>
  <div :style="{ padding: '0 0 32px 32px', height: '100%' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <slot name="barArea"></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import {axisType} from '@/components/Charts/types';

export default defineComponent({
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: ''
    },
    domId: {
      type: String,
      default: 'chartBar'
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props){
    let userChart: any
    const axisData = <axisType[]>props.data
    const domId = <String>props.domId
    const height = ref(100)

    const chartOption = {
      title:{
        text:''
      },
      tooltip: {
        show: true, // 是否显示
        trigger: 'axis',
      },
      dataset:{
        dimensions: ['x'],
        source: axisData
      },
      legend:{},
      xAxis:{
        type: 'category',
        axisTick:{
          show: true
        },
        axisLabel:{
          show: true
        }
      },
      yAxis:{
        type: 'value',
        axisTick:{
          show: true
        },
        axisLabel:{
          show: true
        },
        splitLine: {  //分割线
          show: true
        }
      },
      series:[{
        type:'bar',
        symbol:'none', //去掉折线图中的节点
        smooth: false  //true 为平滑曲线，false为直
      }]
    }
    function elResize() {
      userChart && userChart.resize();
    }
    onMounted(() => {
      // @ts-ignore
      userChart = echarts.init(document.getElementById(domId));
      userChart.setOption(chartOption)
      window.addEventListener('resize', elResize)
    })
    onBeforeUnmount(()=>{
      window.removeEventListener('resize',elResize)
      userChart.dispose()
      userChart = null
      }
    )
    return{
      height
    }
  }
})

</script>
