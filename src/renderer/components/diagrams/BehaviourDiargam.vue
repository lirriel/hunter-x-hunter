<template>
    <basic-chart-box :chart-options="chartOptions" :series="series"/>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BasicChartBox from './BasicChartBox'

    export default {
        name: "BehaviourDiargam",
        props: {
            series: Array,
            x: {
                default: "Prey"
            },
            y: {
                default: "Predator"
            }
        },
        components: {
            apexchart: VueApexCharts,
            BasicChartBox
        },
        data() {
            return {
                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        title: {
                            text: this.x,
                            style: {
                                color: "#883157",
                                fontSize: "14px"
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: this.y,
                            style: {
                                color: "#883157",
                                fontSize: "14px"
                            }
                        }
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'dark',
                            gradientToColors: ['#000000'],
                            shadeIntensity: 4,
                            type: 'vertical',
                            stops: [0, 100, 100, 100]
                        },
                    },
                    tooltip: {
                        x: {},
                        y: {}
                    },
                    legend: {
                        position: 'top',
                        onItemClick: {
                            toggleDataSeries: true
                        },
                    },
                    stroke: {
                        curve: "straight",
                        width: 1.5
                    }
                },
            }
        }
    }
</script>

<style scoped>

</style>