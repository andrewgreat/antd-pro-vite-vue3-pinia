<template>
  <div id="chartDom" :style="{ height: '400px'}">
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, reactive} from 'vue'
import * as echarts from "echarts";
import {ChartSource,AxisIndicator,RadarType} from '@/components/Charts/types';


export default defineComponent({
  name: 'Radar',
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  setup(props){
    // axisData: [
    //   { item: '引用', a: 70, b: 30, c: 40 },
    //   { item: '口碑', a: 60, b: 70, c: 40 },
    //   { item: '产量', a: 50, b: 60, c: 40 },
    //   { item: '贡献', a: 40, b: 50, c: 40 },
    //   { item: '热度', a: 60, b: 70, c: 40 },
    //   { item: '引用', a: 70, b: 50, c: 40 }
    // ]
    const axisData = <ChartSource[]><unknown>props.data

    let userChart: any
    const radarIndicator = <AxisIndicator[]>([])
    const chartData = reactive(<RadarType[]>[])

    const initDataset = ()=>{
      const exists = (ri:AxisIndicator[],val) => {
        for (let i = 0; i < ri.length; i++) {
          if (ri[i].text == val) {
            return true
          }
        }
        return false
      }
      for (const idx in axisData) {
        if (!exists(radarIndicator,axisData[idx].item)){
          if (idx === "0"){
            radarIndicator.push({text:axisData[idx].item,max:80,axisLabel: {show: true}})
          }
          else{
            radarIndicator.push({text:axisData[idx].item,max:80})
          }
        }
      }
      const userMap = {
        person: '个人',
        team: '团队',
        dept: '部门'
      }
      for (const key in userMap) {
        chartData.push({
          name: <String>userMap[key],
          value: axisData.map((it) => {
            return it[key]
          })
        })
      }
    }

    initDataset()

    const chartOption = {
      title: {
        text: ''
      },
      legend: {
        icon: "circle",
        bottom: "5%"
      },
      tooltip : { },
      radar: {
        shape: 'polygon',
        radius: '60%',
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            color: '#645858'
          },
          axisTick:{
            show: true
          },
          axisLabel:{
            show: true,
            color:"red"
          }
        },
        indicator: radarIndicator,
        //雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
        splitArea : {
          show : false,
          areaStyle : {
            color: 'rgba(255,0,0,0)', // 图表背景的颜色
          },
        },
        splitLine : {
          show : true,
          lineStyle : {
            width : 1,
            color : '#ded3d3', // 设置网格的颜色
          },
        },
      },
      series: [
        { type: 'radar', //表示是雷达图
        symbol: 'rect', // 拐点的样式，还可以取值'rect','angle'等
        symbolSize: 8, // 拐点的大小

        areaStyle: {
          normal: {
            width: 1,
            opacity: 0.2,
          },
        },
        data: chartData,
      }],
    }

    function elResize() {
      userChart && userChart.resize();
    }

    onMounted(() => { // 需要获取到element,所以是onMounted的Hook
      // @ts-ignore
      // 基于准备好的dom，初始化echarts实例
      userChart = echarts.init(document.getElementById("chartDom"));
      // 绘制图表
      userChart.setOption(chartOption);
      window.addEventListener('resize', elResize)
    })
    onBeforeUnmount(()=>{
      window.removeEventListener('resize',elResize)
      userChart && userChart.dispose()
      userChart = null
    })

    return {
      // data,
    }
  }
})

</script>

<style scoped>

</style>
