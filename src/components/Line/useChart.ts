import * as echarts from 'echarts';
import useMark from './useMark'
import {
    ChartEventTargetType,
    EChartsOption, EventParamsType, MarkType, MaskItemType,
} from './types';
import { DatasetComponent, GraphicComponent, GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted, ref } from 'vue';
const { getMark, returnMark } = useMark();
export default function useChart() {
    //  chart实例
    let Chart: any;
    // 圆点数据
    let sourceDotPoints = ref<MaskItemType[]>([]);
    const markLabelId: string = 'markLabelId';
    const showLabel = (id: string, x: number, y: number, z: number) => {
        let newId = id.replace('dot', 'label');
        console.log(id, x, y, z);
        Chart.setOption({
            graphic: {
                id: markLabelId,
                type: 'text',
                $action: 'replace',
                x: x - 7,
                y: y - 30,
                z: 9999,
                invisible: false,
                draggable: false,
                shape: {
                    width: 40,
                    height: 20
                },
                style: {
                    text: newId.replace('label-', ''),
                    fill: '#95a5a6',
                    lineWidth: 1,
                    font: '14px Fira Sans, sans-serif'
                },
                transition: 'style',
                zlevel: 999
            }
        });
    };
    const hiddenLabel = (id: string): void => {
        let option = Chart!.getOption();
        option.graphic = [
            {
                id: markLabelId,
                $action: 'replace',
                type: 'text',
                invisible: false
            }
        ];
        Chart.setOption(option);
    };

    // 绘画圆点
    const drawAllDot = () => {
        Chart.setOption({
            graphic: echarts.util.map(sourceDotPoints.value, function (item, dataIndex) {
                return {
                    id: item.id,
                    type: 'circle',
                    position: Chart.convertToPixel('grid', item.data),
                    shape: { r: 10 / 2 },
                    invisible: false,
                    draggable: false,
                    style: {
                        fill: '#ffffff',
                        stroke: '#5470c6'
                    },
                    z: 100,
                    onmouseover: function (e: MouseEvent) {
                        // 渲染label
                        let target: ChartEventTargetType = e.target as ChartEventTargetType;
                        console.log('target', target);
                        showLabel(target.id, target.x, target.y, target.z);
                    },
                    onmouseout: function () {
                        // 清空label
                        hiddenLabel(this.id);
                    }
                };
            })
        });
    };
    const createChart = (lineChartDom: HTMLElement, option: EChartsOption) => {
        Chart = echarts.init(lineChartDom);
        Chart.setOption(option);
        Chart.on('mouseup', function (params: EventParamsType) {
            if (params.componentType === 'series') {
                // 约束只能5个元素
                if (sourceDotPoints.value.length < 5) {
                    const id: MarkType = getMark();
                    let dotObj: MaskItemType = {
                        id: `dot-${id}`,
                        data: params.data
                    };
                    let labelObj: MaskItemType = {
                        id: `label-${id}`,
                        data: params.data
                    };
                    // 添加到maskPoint并绘画
                    sourceDotPoints.value.push(dotObj);
                    drawAllDot();
                }
            }
        })
        Chart.on('mousedown', function (params: EventParamsType) {
            if (params.componentType === 'graphic') {
                console.log('圆点被点击了');
                let cur: ChartEventTargetType = params.event.target as ChartEventTargetType;
                if (cur === null) return;
                let option = Chart!.getOption();
                let id = cur.id;
                // 删除圆点和label
                option.graphic = {
                    id: id,
                    $action: 'remove'
                };
                hiddenLabel(id)
                Chart.setOption(option);
                // 从记录中删除圆点
                let index = sourceDotPoints.value.findIndex((item) => (item.id = id));
                sourceDotPoints.value.splice(index, 1);
                //  把标签还回去
                let newId: MarkType = cur.id.replace('dot-', '') as MarkType;
                returnMark(newId);
                queueMicrotask(() => {
                    drawAllDot();
                })
            }
        });
    };

    return {
        createChart
    };
}
