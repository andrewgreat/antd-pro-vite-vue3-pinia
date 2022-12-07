<template>
  <div :style="{ height: '80vh' }">
    <div
      id="chartTransferBar"
      class="chart-wrapper"
      :style="{ height: '60vh' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";

export default defineComponent({
  name: "TransferBar",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  setup() {
    let userChart: any;
    const month = dayjs().add(-1, "month").format("YYYY-MM");
    const days = dayjs().daysInMonth();
    const barData = ref([]);
    const getMonthBar = function () {
      for (let i = 0; i < days; i++) {
        barData.value.push({
          x: dayjs()
            .add(-1, "month")
            .startOf("month")
            .add(i, "day")
            .format("DD日"),
          y: Math.round(Math.random() * 10),
        });
      }
    };
    getMonthBar();
    const chartOption = {
      title: [
        {
          left: "center",
          text: `${month}月每日流量`, // 标题
        },
        {
          right: "10",
          text: "柱状图", // 副标题
          textStyle: {
            lineHeight: "45",
            color: "pink",
          },
        },
      ],
      tooltip: {
        show: true, // 是否显示
        trigger: "axis",
      },
      dataset: {
        dimensions: ["x"],
        source: barData.value,
      },
      legend: {},
      xAxis: {
        name: "日期(天)", //坐标名字
        type: "category",
        axisTick: {
          show: true,
        },
        axisLabel: {
          show: true,
        },
      },
      yAxis: {
        name: "流量(Gb)", //坐标名字
        type: "value",
        axisTick: {
          show: true,
        },
        axisLabel: {
          show: true,
        },
        splitLine: {
          //分割线
          show: true,
        },
      },
      color: ["#1890ff", "#52c41a", "#faad14"], // 柱状图颜色
      series: [
        {
          type: "bar",
          symbol: "none", //去掉折线图中的节点
          smooth: true, //true 为平滑曲线，false为直
          areaStyle: {},
          label: {
            // 柱图头部显示值
            show: true,
            position: "top",
            color: "#333",
            fontSize: "12px",
            formatter: (params) => {
              return params.value[params.encode.x[0]];
            },
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
      userChart = echarts.init(document.getElementById("chartTransferBar"));
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
