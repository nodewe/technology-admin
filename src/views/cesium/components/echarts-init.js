
import { graphic } from "echarts"
export const pieOptions = {
    title: {
        text: '{a|城市数据}',
        textStyle: {
            color: '#ffffff',
            rich: {
                a: {
                    fontSize: 16,
                    letterSpace: 3
                }
            }
        },
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}%'
    },
    legend: {
        show: false,
        bottom: 10,
        left: 'center',
        data: ['云岩区', '观山湖', '白云区', '南明区', '花溪区']
    },

    series: [
        {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {
                    //每个图的颜色
                    itemStyle: {
                        color: 'rgba(54, 121, 132,0.5)'
                    },
                    value: 1548,
                    name: '云岩区',
                    label: {
                        color: '#fff'
                    }
                },
                {
                    itemStyle: {
                        color: 'rgba(66, 165, 245,0.5)'
                    },
                    value: 735, name: '观山湖',
                    label: {
                        color: '#fff'
                    }
                },
                {
                    itemStyle: {
                        color: 'rgba(81, 245, 234,0.5)'
                    },
                    value: 510, name: '白云区',
                    label: {
                        color: '#fff'
                    }
                },
                {
                    itemStyle: {
                        color: 'rgba(125, 245, 159,0.5)'
                    },
                    value: 434, name: '南明区',
                    label: {
                        color: '#fff'
                    }
                },
                {
                    itemStyle: {
                        color: 'rgba(71, 222, 245,0.5)'
                    },
                    value: 335, name: '花溪区',
                    label: {
                        color: '#fff'
                    }
                }
            ],

        }
    ]
};

export const lineOptions = {
    title: {
        text: '{a|城市数据}',
        textStyle: {
            color: '#ffffff',
            rich: {
                a: {
                    fontSize: 16,
                    letterSpace: 3
                }
            }
        },
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}%'
    },
    legend: {
        show: false,
        bottom: 10,
        left: 'center',
        data: ['云岩区', '观山湖', '白云区', '南明区', '花溪区']
    },
    xAxis: {
        data:  ['云岩区', '观山湖', '白云区', '南明区', '花溪区'],
        axisLabel: {
            color: '#fff'
        }
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff'
        }
    },
    series: [
        {
            type: 'bar',
            showBackground: true,
            itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#47f0ff' },
                    { offset: 1, color: '#367984' }
                ])
            },
            data: [
                {

                    value: 1548,
                    name: '云岩区',
                    label: {
                        color: '#fff'
                    }
                },
                {

                    value: 735, name: '观山湖',
                    label: {
                        color: '#fff'
                    }
                },
                {

                    value: 510, name: '南明区',
                    label: {
                        color: '#fff'
                    }
                },
                {

                    value: 434, name: '白云区',
                    label: {
                        color: '#fff'
                    }
                },
                {
                    value: 335, name: '花溪区',
                    label: {
                        color: '#fff'
                    }
                }
            ],

        }
    ]
};