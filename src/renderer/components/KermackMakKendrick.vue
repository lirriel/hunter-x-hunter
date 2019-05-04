<template>
    <div>
        <h2>Kermack-MakKendrick model</h2>
        <b-row>
            <b-col sm="3">
                <kermack-mac-kendrick-controller
                        @series="onSeries"
                        @seriesBehave="onSeriesBehave"/>
            </b-col>
            <b-col sm="9">
                <div>
                    <basic-chart-box :chart-options="chartOptions" :series="series.series" id="kmkSeries"/>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-tabs style="width: 700px">
                <b-tab title="Behaviour" active>
                    <behaviour-diargam :series="seriesBehave.series" id="kmkBehave"/>
                </b-tab>
            </b-tabs>
        </b-row>
    </div>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from './diagrams/BehaviourDiargam'
    import KermackMacKendrickController from './control-panel/KermackMacKendrickController'
    import BasicChartBox from './diagrams/BasicChartBox'

    export default {
        name: "KermackMakKendrick",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam,
            KermackMacKendrickController,
            BasicChartBox
        },
        data() {
            return {
                currentParams: {},
                chartOptions: {
                    title: {
                        text: 'Infection population size'
                    },
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: "left",
                        offsetX: 10,
                        onItemClick: {
                            toggleDataSeries: true
                        },
                    },
                    grid: {
                        clipMarkers: false
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        x: {},
                        y: {}
                    },
                    yaxis: [
                        {
                            axisTicks: {
                                show: true
                            },
                            axisBorder: {
                                show: true,
                                color: "#FF1654"
                            },
                            labels: {
                                style: {
                                    color: "#FF1654"
                                },
                                show: true,
                                rotate: -45,
                                rotateAlways: false,
                                hideOverlappingLabels: true,
                                showDuplicates: false,
                                trim: true,
                                formatter: function (value) {
                                    return value.toFixed(2)
                                }
                            },
                            title: {
                                text: "Group size"
                            }
                        }
                    ],
                    stroke: {
                        curve: "straight",
                        width: 1
                    },
                },
                series: [],
                seriesBehave: []
            }
        },
        methods: {
            onSeries(data) {
                console.log(data);
                this.series = data;
            },
            onSeriesBehave(data) {
                this.seriesBehave = data;
            }
        }
    }
</script>

<style scoped>

</style>