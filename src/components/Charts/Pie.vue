<template>
  <div :style="{ padding: '0 0 32px 32px', width: '100%', height: '100%' }">
    <h4 :style="{ marginBottom: '15px' }">{{ title }}</h4>
    <slot name="pieArea"></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import { pieType } from '@/components/Charts/types';

export default defineComponent({
  name: 'Pie',
  props: {
    title: {
      type: String,
      default: ''
    },
    domId: {
      type: String,
      default: 'chartPie'
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
    const pieData = <pieType[]>props.data

    const domId = <String>props.domId

    const height = ref(100)

    const chartOption = {
      title:{
        text:'',
        top:'top',
        left:'center',
        textStyle:{
          fontSize: 12,
          fontWeight: '',
          color: '#333'
        },
      },//标题
      tooltip: {
        trigger: 'item',
        formatter: ' {b}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{d}%'
      },
      dataset:{
        dimensions: ['item','count'],
        source: pieData
      },
      legend: {
        show: true,
        icon: "circle",
        orient: 'horizontal',
        y: 'bottom'
      },//图例属性，以饼状图为例，用来说明饼状图每个扇区，data与下边series中data相匹配
      graphic:{
        type:'text',
          left:'center',
          top:'center',
          style:{
          text:'销售额统计', //使用“+”可以使每行文字居中
            textAlign:'center',
            font:'italic bolder 12px cursive',
            fill:'#000',
            width:30,
            height:30
        }
      },
      series: [
        {
          name:'',//tooltip提示框中显示内容
          type: 'pie',
          radius: ['35%', '65%'],//饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
          //roseType:'area',是否显示成南丁格尔图，默认false
          itemStyle: {
            label:{
              show:true,
              textStyle:{color:'#3c4858',fontSize:"12"},
              formatter:function(val){   //让series 中的文字进行换行
                return val.name.split("-").join("\n");}
            },
            //饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。可以与itemStyle属性同级，具体看文档
            labelLine:{
              show:true,
              //线条颜色
              lineStyle:{color:'#3c4858'}
              }
          },
          color: ['#f9d237','#f0627a','#965ee3','#3aa0fd','#36c9c9','#4dc972'],//各个区域颜色
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',//鼠标放在区域边框颜色
              textColor:'#000'
            }
          }
        },//数组中一个{}元素，一个图，以此可以做出环形图
    ],//系列列表
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
    })

    return{
      height
    }
  }
})

</script>
