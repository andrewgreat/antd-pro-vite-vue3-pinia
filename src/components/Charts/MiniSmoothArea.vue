<template>
  <div :class="prefixCls" :style="{ height: '100%' }">
      <slot name="chart"></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import {axisType} from '@/components/Charts/types';

export default defineComponent({
  name: 'MiniSmoothArea',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-smooth-area'
    },
    domId: {
      type: String,
      default: 'chartMiniSmoothArea'
    },
    dataSource: {
      type: Array,
      required: true
    }
  },
  setup(props){
    const height = ref(100)
    let userChart: any
    const axisData = <axisType[]>props.dataSource
    const domId = <String>props.domId

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
          show: false
        },
        axisLabel:{
          show: false
        }
      },
      yAxis:{
        type: 'value',
        axisTick:{
          show: false
        },
        axisLabel:{
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series:[{
        type:'line',
        symbol:'none',
        smooth: true,
        areaStyle: {
        }
      }]
    }

    function elResize() {
      userChart && userChart.resize();
    }

    onMounted(() => {
      // console.log(chartMiniSmoothArea)
      // @ts-ignore
      userChart = echarts.init(document.getElementById(domId));
      userChart.setOption(chartOption);
      window.addEventListener('resize', elResize)
    })
    onBeforeUnmount(()=>{
      window.removeEventListener('resize',elResize)
      userChart.dispose()
      userChart = null
    })

    return{
      height
    }
  }
})
</script>

<style lang="less" scoped>
  @import "smooth.area.less";
</style>
