<template>
  <div class="chart-trend">
    {{ term }}
    <span>{{ rate }}%</span>
    <span :class="['trend-icon', trend]">
      <caret-up-outlined  v-if="trend === 'up'" />
      <caret-down-outlined v-else />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChartTrend",
  props: {
    term: {
      type: String,
      default: "",
      required: true,
    },
    percentage: {
      type: Number,
      default: null,
    },
    type: {
      type: Boolean,
      default: null,
    },
    target: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    fixed: {
      type: Number,
      default: 2,
    },
  },
  setup(props) {
    const type = props.type === null ? props.value >= props.target : props.type;
    const trend = type ? "up" : "down";
    const rate = (
      props.percentage === null
        ? (Math.abs(props.value - props.target) * 100) / props.target
        : props.percentage
    ).toFixed(props.fixed);
    return {
      trend,
      rate,
    };
  },
});
</script>

<style lang="less" scoped>
.chart-trend {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;

  .trend-icon {
    font-size: 12px;

    &.up,
    &.down {
      margin-left: 4px;
      position: relative;
      top: 1px;

      i {
        font-size: 12px;
        transform: scale(0.83);
      }
    }

    &.up {
      color: #f5222d;
    }
    &.down {
      color: #52c41a;
      top: -1px;
    }
  }
}
</style>
