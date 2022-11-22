<template>
  <div class="antv-chart-mini" :style="{ height: '100%' }">
    <div id="chartMiniBar" class="chart-wrapper" :style="{ height: '8vh' }">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
import dayjs from 'dayjs'
import {axisType} from '@/components/Charts/types';
import * as echarts from 'echarts';

export default defineComponent({
  name: "MiniBar",
  setup(){
    let userChart: any
    const axisData = <axisType[]>[]

    const beginDay = new Date().getTime()

    for (let i = 0; i < 10; i++) {
      axisData.push({
        x: dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: Math.round(Math.random() * 10)
      })
    }

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
        splitLine: {  //分割线
          show: false
        }
      },
      series:[{
        type:'bar',
        symbol:'none', //去掉折线图中的节点
        smooth: true,  //true 为平滑曲线，false为直
        areaStyle: {
        }
      }]
    }

    function elResize() {
      userChart && userChart.resize();
    }

    onMounted(() => { // 需要获取到element,所以是onMounted的Hook
      // @ts-ignore
      // 基于准备好的dom，初始化echarts实例
      userChart = echarts.init(document.getElementById("chartMiniBar"));
      // 绘制图表
      userChart.setOption(chartOption);
      window.addEventListener('resize', elResize)
    })
    onBeforeUnmount(()=>{
      window.removeEventListener('resize',elResize)
      userChart.dispose()
      userChart = null
    })

    return {
      height
    }
  }

})

</script>

<style lang="less" scoped>
  @import "chart";
</style>
