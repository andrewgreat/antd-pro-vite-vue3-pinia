<template>
  <div :style="{ height: '80vh' }">
    <div
      id="chartLiquid"
      class="chart-wrapper"
      :style="{ height: '60vh' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-liquidfill";

export default defineComponent({
  name: "Liquid",
  props: {
    height: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    let userChart: any;
    const chartOption = {
      series: [
        {
          type: "liquidFill",
          data: [0.6, 0.55, 0.4, 0.25],
          radius: "60%",
          outline: {
            show: false,
          },
          backgroundStyle: {
            borderColor: "#156ACF",
            borderWidth: 1,
            shadowColor: "rgba(0, 0, 0, 0.4)",
            shadowBlur: 20,
          },
         
          label: {
            position: ["50%", "20%"],
            formatter: function () {
              return "ECharts\n水波图";
            },
            fontSize: 40,
            color: "#D94854",
          },
        },
      ],
    };
    function elResize() {
      userChart && userChart.resize();
    }
    onMounted(() => {
      // 需要获取到element,所以是onMounted的Hook
      // @ts-ignore
      // 基于准备好的dom，初始化echarts实例
      userChart = echarts.init(document.getElementById("chartLiquid"));
      // 绘制图表
      userChart.setOption(chartOption);
      window.addEventListener("resize", elResize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", elResize);
      userChart.dispose();
      userChart = null;
    });

    return {};
  },
});
</script>

<style scoped></style>
