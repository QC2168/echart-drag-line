import { EChartsOption, ChartDataItem } from './types';
import { ref } from "vue";

export default function useOption() {
  let option = ref<EChartsOption>({
    height: 120,
    grid: {
      show: false
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      showContent: false,
      axisPointer: {
        animation: false,
        label: {
          show: false
        },
        lineStyle: {
          opacity: 0
        }
      }
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value', //坐标轴类型，一定要写，否则显示会出问题
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
        length: 1
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        data: [],
        type: 'line',
        color: '#5470c6',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#5470c6'
        },
        zlevel: 0
      }
    ]
  });
  const updateData = (data: ChartDataItem[]) => {
    // @ts-ignore
    option.value.series[0].data = data;
  };
  return {
    option,
    updateData
  };
}
