<template>
    <div>
        <h2>J.Monod Chemostat model</h2>
        <b-row>
            <b-col sm="4">
                <jacob-monod-controller @curve="onMonodCurve" @series="onSeries"
                                        @model="onModelChanged"
                                        @addToChart="addToChart"
                                        @removeChart="removeChart"
                                        @seriesBehave="onSeriesBehave"/>
            </b-col>
            <b-col sm="8">
                <div>
                    <basic-chart-box :chart-options="chartOptions" :series="series.series"
                                     id="jmSeries"/>
                </div>
            </b-col>
        </b-row>
        <vs-divider/>
        <b-row>
            <b-tabs style="width: 100%">
                <b-tab active title="Behaviour">
                    <div class="inside-tab">
                        <behaviour-diargam :series="seriesBehave.series" :x="'Nutrient'"
                                           :y="'Bacteria'"
                                           style="width: 900px"
                                           id="jmBehave"/>
                    </div>
                </b-tab>
                <b-tab active title="Monod curve">
                    <div class="inside-tab">
                        <behaviour-diargam :series="seriesCurve" :x="'Nutrient'"
                                           :y="'Monod function'"
                                           style="width: 900px"
                                           id="jmCurve"/>
                    </div>
                </b-tab>
                <b-tab title="Customize">
                    <div class="inside-tab">
                        <calculate-custom-parameters
                                :input-model="currentModel"></calculate-custom-parameters>
                    </div>
                </b-tab>
            </b-tabs>
        </b-row>
    </div>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from '../diagrams/BehaviourDiargam'
    import JacobMonodController from "../control-panels/JacobMonodController"
    import BasicChartBox from '../diagrams/BasicChartBox'
    import CalculateCustomParameters from '../CalculateCustomParameters'
    import {JacobMonod} from "../../assets/jacobMonod";

    export default {
        name: "JacobMonod",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam,
            JacobMonodController,
            BasicChartBox,
            CalculateCustomParameters
        },
        data() {
            return {
                currentModel: new JacobMonod(0, 0, 0, 0, 0),
                chartOptions: {
                    title: {
                        text: 'Chemostat biomass and bacteria size'
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
                                text: "bacteria"
                            }
                        },
                        {
                            opposite: true,
                            axisTicks: {
                                show: true
                            },
                            axisBorder: {
                                show: true,
                                color: "#247BA0"
                            },
                            labels: {
                                style: {
                                    color: "#247BA0"
                                },
                                show: true,
                                rotate: -45,
                                rotateAlways: false,
                                hideOverlappingLabels: true,
                                showDuplicates: false,
                                trim: true,
                                formatter: function (value) {
                                    return value.toFixed(2);
                                }
                            },
                            title: {
                                text: "nutrient"
                            }
                        }
                    ],
                    stroke: {
                        curve: "straight",
                        width: 1
                    },
                },

                series: [],
                seriesBehave: [],
                seriesCurve: [],
                comparedSeries: []
            }
        },
        methods: {
            onSeries(data) {
                this.series = data;
                if (this.comparedSeries.length >0 ){
                    this.series.series.push(this.comparedSeries[0])
                    this.series.series.push(this.comparedSeries[1])
                }
            },
            onSeriesBehave(data) {
                this.seriesBehave = data;
            },
            onMonodCurve(data) {
                this.seriesCurve = data;
            },
            onModelChanged(data) {
                this.currentModel = data.model;
            },
            addToChart(data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].name += " - 1"
                }
                this.comparedSeries = data;
            },
            removeChart() {
                if (this.comparedSeries.length > 0) {
                    this.series.series = this.series.series.slice(0, 2);
                    this.comparedSeries = []
                }
            },
        }
    }
</script>

<style scoped>
    .inside-tab {
        margin-top: 20px;
        margin-left: 30px;
    }
</style>