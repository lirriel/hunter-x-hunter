<template>
    <b-row>
        <b-col sm="3"></b-col>
        <b-col sm="9">
            <basic-chart-box :series="series" :chart-options="chartOptions" :type="type"></basic-chart-box>
        </b-col>
    </b-row>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BasicChartBox from './BasicChartBox'
    export default {
        name: "BehaviourDiargam",
        props: {
            series: Array,
        },
        components: {
          apexchart: VueApexCharts,
            BasicChartBox
        },
        data() {
            return {
                type: 'line',
                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    // markers: {
                    //     size: [0.3, 5],
                    //     colors: ['pink'],
                    //     hover: {
                    //         size: 3
                    //     }
                    // },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'dark',
                            gradientToColors: [ '#000000'],
                            shadeIntensity: 1,
                            type: 'vertical',
                            stops: [0, 100, 100, 100]
                        },
                    },
                    tooltip: {
                        shared: false,
                        intersect: true,
                    },
                    legend: {
                        position: 'top',
                        onItemClick: {
                            toggleDataSeries: true
                        },
                    },
                    stroke: {
                        curve: "straight",
                        width: 1
                    },
                }
            }
        }
    }
</script>

<style scoped>

</style>