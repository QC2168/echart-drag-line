import { ref } from 'vue';
import { ChartDataItem } from './types';

export default function useInitData() {
  const data = ref<ChartDataItem[]>([]);
  function func(x: number): number {
    x /= 60;
    return Math.sin(x) * 10 + 10;
  }

  for (let i = 0; i <= 800; i += 0.1) {
    data.value.push([i, func(i)]);
  }
  return { data };
}
