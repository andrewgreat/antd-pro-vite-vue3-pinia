<template>
  <div :style="{ padding: '0 0 32px 32px', width: '100%', height: '100%' }">
    <div id="chartTagCloud" :style="{ width: '100%', height: '100vh' }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-wordcloud";

export default defineComponent({
  name: "TagCloud",
  props: {
    tagList: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 400,
    },
    width: {
      type: Number,
      default: 640,
    },
  },
  setup(props) {

    const imgSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbgAAAEsCAYAAACxPabmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTExLTI5VDE4OjMzOjE5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMS0yOVQxOTo1ODo1MSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMS0yOVQxOTo1ODo1MSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplM2IxMDMzNC0yOTg2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iCJwXWRywwZbeftt12MAzsQ+/nElRkaUOnSIqHUBAteFpv/6r235+99X5ac/ZbNDpBljFLvtNsV37FDqz/+cqHUZAgcV7r3Xlo8elZ2edj0K0DKTSim+davSL71E0LocgcM1in/0R7b80kuqXr7sehSgbt4NNyh+773q/ed/Jmq4isBhUdNPPGHLr76qyokT3JGJQDGxmGKbNim+fbtSTz5J1LAgAoe6TR08WAvee++5HgVdKHbLLYpv366ep58maKgLgUPTCrt328rRo6peuuR6FESQNzio2NatSr/wAkFDUwgcfFPcv99WXntNlbNnXY+CEIqtWaPY5s3qfe45ggZfEDi0zdRXvlIL3okTsqWS63EQICaZVGzTJsU2b1bPU08RNLQFgUPHlA4ftpWf/UyVN99U9dQp3g2hS5h4XN769Yrdeqtin/iEko88QtDQEQQOzk09/LCtvPmmKj//uezUlOtx0ALT06PYxz6m2K23queZZwgZnCJwCJyZ73zHVk+dUuX0aVVPn1b17Fl+CT1gTColb80aeevWKbZunbz165UYGSFoCBQCh1DKb95sq++8wx2cbeYNDspbu1Z9r71GvBA6BA6RMvXYY7b6y1/Knjun6rlzshcv8nqbizDGyKxYIW94WGZ4mNvxETkEDl2hfOSItWNjshcvqnrxYi18Fy/KXrjw679H5Pqf6emphWvFCpmhIZkVK3799xUrZFauVHzbNmKGyCNwwBzV996z9n//V3Z8XJqYkJ2YkM3lan9OTNS+Nv/v09NSuSyVy7IzM1c/18xM7U7RuV+TpHi89pFIyFz5c/ZrZu7nqZSUycjMfmSz1/3dZDK1rw0MyPzmb8q75RbCBVzx/wKmA7deSdk6AAAAAElFTkSuQmCC"
    // const imgUrl = "/public/images/tag-cloud.png";

    const tagCloudList = [
      { value: 9, name: "AntV" },
      { value: 8, name: "ECharts" },
      { value: 8, name: "F2" },
      { value: 8, name: "G2" },
      { value: 8, name: "G6" },
      { value: 8, name: "DataSet" },
      { value: 8, name: "墨者学院" },
      { value: 6, name: "Analysis" },
      { value: 6, name: "Data Mining" },
      { value: 6, name: "Data Vis" },
      { value: 6, name: "Design" },
      { value: 6, name: "Grammar" },
      { value: 6, name: "Graphics" },
      { value: 6, name: "Graph" },
      { value: 6, name: "Hierarchy" },
      { value: 6, name: "Labeling" },
      { value: 6, name: "Layout" },
      { value: 6, name: "Quantitative" },
      { value: 6, name: "Relation" },
      { value: 6, name: "Statistics" },
      { value: 6, name: "可视化" },
      { value: 6, name: "数据" },
      { value: 6, name: "数据可视化" },
      { value: 4, name: "Arc Diagram" },
      { value: 4, name: "Bar Chart" },
      { value: 4, name: "Canvas" },
      { value: 4, name: "Chart" },
      { value: 4, name: "DAG" },
      { value: 4, name: "DG" },
      { value: 4, name: "Facet" },
      { value: 4, name: "Geo" },
      { value: 4, name: "Line" },
      { value: 4, name: "MindMap" },
      { value: 4, name: "Pie" },
      { value: 4, name: "Pizza Chart" },
      { value: 4, name: "Punch Card" },
      { value: 4, name: "SVG" },
      { value: 4, name: "Sunburst" },
      { value: 4, name: "Tree" },
      { value: 4, name: "UML" },
      { value: 3, name: "Chart" },
      { value: 3, name: "View" },
      { value: 3, name: "Geom" },
      { value: 3, name: "Shape" },
      { value: 3, name: "Scale" },
      { value: 3, name: "Animate" },
      { value: 3, name: "Global" },
      { value: 3, name: "Slider" },
      { value: 3, name: "Connector" },
      { value: 3, name: "Transform" },
      { value: 3, name: "Util" },
      { value: 3, name: "DomUtil" },
      { value: 3, name: "MatrixUtil" },
      { value: 3, name: "PathUtil" },
      { value: 3, name: "G" },
      { value: 3, name: "2D" },
      { value: 3, name: "3D" },
      { value: 3, name: "Line" },
      { value: 3, name: "Area" },
      { value: 3, name: "Interval" },
      { value: 3, name: "Schema" },
      { value: 3, name: "Edge" },
      { value: 3, name: "Polygon" },
      { value: 3, name: "Heatmap" },
      { value: 3, name: "Render" },
      { value: 3, name: "Tooltip" },
      { value: 3, name: "Axis" },
      { value: 3, name: "Guide" },
      { value: 3, name: "Coord" },
      { value: 3, name: "Legend" },
      { value: 3, name: "Path" },
      { value: 3, name: "Helix" },
      { value: 3, name: "Theta" },
      { value: 3, name: "Rect" },
      { value: 3, name: "Polar" },
      { value: 3, name: "Dsv" },
      { value: 3, name: "Csv" },
      { value: 3, name: "Tsv" },
      { value: 3, name: "GeoJSON" },
      { value: 3, name: "TopoJSON" },
      { value: 3, name: "Filter" },
      { value: 3, name: "Map" },
      { value: 3, name: "Pick" },
      { value: 3, name: "Rename" },
      { value: 3, name: "Filter" },
      { value: 3, name: "Map" },
      { value: 3, name: "Pick" },
      { value: 3, name: "Rename" },
      { value: 3, name: "Reverse" },
      { value: 3, name: "sort" },
      { value: 3, name: "Subset" },
      { value: 3, name: "Partition" },
      { value: 3, name: "Imputation" },
      { value: 3, name: "Fold" },
      { value: 3, name: "Aggregate" },
      { value: 3, name: "Proportion" },
      { value: 3, name: "Histogram" },
      { value: 3, name: "Quantile" },
      { value: 3, name: "Treemap" },
      { value: 3, name: "Hexagon" },
      { value: 3, name: "Binning" },
      { value: 3, name: "kernel" },
      { value: 3, name: "Regression" },
      { value: 3, name: "Density" },
      { value: 3, name: "Sankey" },
      { value: 3, name: "Voronoi" },
      { value: 3, name: "Projection" },
      { value: 3, name: "Centroid" },
      { value: 3, name: "H5" },
      { value: 3, name: "Mobile" },
      { value: 3, name: "K线图" },
      { value: 3, name: "关系图" },
      { value: 3, name: "烛形图" },
      { value: 3, name: "股票图" },
      { value: 3, name: "直方图" },
      { value: 3, name: "金字塔图" },
      { value: 3, name: "分面" },
      { value: 3, name: "南丁格尔玫瑰图" },
      { value: 3, name: "饼图" },
      { value: 3, name: "线图" },
      { value: 3, name: "点图" },
      { value: 3, name: "散点图" },
      { value: 3, name: "子弹图" },
      { value: 3, name: "柱状图" },
      { value: 3, name: "仪表盘" },
      { value: 3, name: "气泡图" },
      { value: 3, name: "漏斗图" },
      { value: 3, name: "热力图" },
      { value: 3, name: "玉玦图" },
      { value: 3, name: "直方图" },
      { value: 3, name: "矩形树图" },
      { value: 3, name: "箱形图" },
      { value: 3, name: "色块图" },
      { value: 3, name: "螺旋图" },
      { value: 3, name: "词云" },
      { value: 3, name: "词云图" },
      { value: 3, name: "雷达图" },
      { value: 3, name: "面积图" },
      { value: 3, name: "马赛克图" },
      { value: 3, name: "盒须图" },
      { value: 3, name: "坐标轴" },
      { value: 3, name: "" },
      { value: 3, name: "Jacques Bertin" },
      { value: 3, name: "Leland Wilkinson" },
      { value: 3, name: "William Playfair" },
      { value: 3, name: "关联" },
      { value: 3, name: "分布" },
      { value: 3, name: "区间" },
      { value: 3, name: "占比" },
      { value: 3, name: "地图" },
      { value: 3, name: "时间" },
      { value: 3, name: "比较" },
      { value: 3, name: "流程" },
      { value: 3, name: "趋势" },
      { value: 2, name: "亦叶" },
      { value: 2, name: "再飞" },
      { value: 2, name: "完白" },
      { value: 2, name: "巴思" },
      { value: 2, name: "张初尘" },
      { value: 2, name: "御术" },
      { value: 2, name: "有田" },
      { value: 2, name: "沉鱼" },
      { value: 2, name: "玉伯" },
      { value: 2, name: "画康" },
      { value: 2, name: "祯逸" },
      { value: 2, name: "绝云" },
      { value: 2, name: "罗宪" },
      { value: 2, name: "萧庆" },
      { value: 2, name: "董珊珊" },
      { value: 2, name: "陆沉" },
      { value: 2, name: "顾倾" },
      { value: 2, name: "Domo" },
      { value: 2, name: "GPL" },
      { value: 2, name: "PAI" },
      { value: 2, name: "SPSS" },
      { value: 2, name: "SYSTAT" },
      { value: 2, name: "Tableau" },
      { value: 2, name: "D3" },
      { value: 2, name: "Vega" },
      { value: 2, name: "统计图表" },
    ];
    let userChart: any;
    let chartOption = {};
    function elResize() {
      userChart && userChart.resize();
    }
    const maskResource = new Image();
    maskResource.src = imgSrc;
    maskResource.onerror = () => {
      console.log("error");
    };
    maskResource.onload = function () {
      // 等待背景图片加载成功
      chartOption = {
        //设置标题，居中显示
        title: {
          text: "E词云图",
          left: "center",
        },
        //数据能够点击
        tooltip: {},
        series: [
          {
            type: "wordCloud",
            // 形状
            shape: "circle",
            //保持maskImage的纵横比
            keepAspect: true,
            // 轮廓图像
            maskImage: maskResource,
            // 位置和高宽
            left: "center",
            top: "top",
            width: "70%",
            height: "80%",
            right: null,
            bottom: null,
            // 文本大小范围 12px ~ 60px
            sizeRange: [12, 60],
            //文本旋转范围和步长
            rotationRange: [-90, 90],
            rotationStep: 45,
            // 画布可用性的网格大小
            gridSize: 8,
            // 是否允许将单词部分绘制到画布之外
            drawOutOfBound: false,
            // 是否收缩文本
            shrinkToFit: false,
            // 布局动画
            layoutAnimation: true,
            // 全局文本样式
            textStyle: {
              fontFamily: "sans-serif",
              fontWeight: "bold",
              // 颜色
              color: function () {
                // 随机颜色
                return (
                  "rgb(" +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                  ].join(",") +
                  ")"
                );
              },
            },
            emphasis: {
              focus: "self",
              textStyle: {
                textShadowBlur: 10,
                textShadowColor: "#333",
              },
            },
            //调用数据
            data: tagCloudList,
          },
        ],
      };

      // @ts-ignore
      // 基于准备好的dom，初始化echarts实例
      userChart = echarts.init(document.getElementById("chartTagCloud"), null, { renderer: 'svg' });
      // 绘制图表
      userChart.setOption(chartOption);
      window.addEventListener("resize", elResize);
    };
    onMounted(() => {});
    onBeforeUnmount(() => {
      // maskResource.disdr
      window.removeEventListener("resize", elResize);
      userChart.dispose();
      userChart = null;
    });
    return {
      tagCloudList,
    };
  },
});
</script>
