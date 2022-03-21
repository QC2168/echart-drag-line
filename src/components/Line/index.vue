<template>
  <div>
    <div id="lineChartDom" ref="lineChartDom" :style="{ width: '780px', height: '200px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useChart from './useChart';
import useInitData from './useData';
import useOption from './useOption';
import { EChartsOption } from './types'

const lineChartDom = ref<HTMLElement>();
const { data } = useInitData();
const { option, updateData } = useOption();
const { createChart,sourceDotPoints } = useChart();

onMounted(() => {
  updateData(data.value)
  createChart(lineChartDom.value!, (option.value as EChartsOption));
});

</script>

<style scoped></style>
