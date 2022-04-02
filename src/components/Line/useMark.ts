import { ref } from 'vue';
import { MarkType } from './types';

export default function useMark() {
  // 分配标签
  let marks = ref<MarkType[]>([MarkType.H1, MarkType.H2 ,MarkType.H3, MarkType.H4, MarkType.H5]);
  const getMark = (): MarkType => {
    if (marks.value.length !== 0) {
      return marks.value.shift() as MarkType;
    } else {
      throw Error('标签已分配完毕');
    }
  };
  const returnMark = (mark: MarkType) => {
    return marks.value.unshift(mark);
  };
  return {
    getMark,
    returnMark
  };
}
