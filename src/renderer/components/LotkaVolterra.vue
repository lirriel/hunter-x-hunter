<template>
    <div id="page">
        <h2>Lotka-Volterra model</h2>
        <b-row>
            <b-col sm="3">
                <lotka-volterra-control-panel @behaviour="onBehaviour"
                                              @bifurcation="onBifurcation"
                                              @compare="onCompare"
                                              @series="onSeries"
                                              @savePdf="onSavePdf"
                />
            </b-col>
            <b-col sm="9" id="seriesCharts">
                <div>
                    <b-row>
                        <b-col>
                            <basic-chart-box style="width: 1000px" id="currentChart"
                                             :chart-options="chartOptions"
                                             :series="series"/>

                        </b-col>
                    </b-row>
                    <b-row>
                        <div v-for="s in seriesCompare"
                             v-if="compareFlag" id="seriesCompare">
                            <b-col>
                                <label style="font-color: gray">{{s.params}}</label>
                                <basic-chart-box :chart-options="chartOptions"
                                                 :series="s.series"/>
                            </b-col>
                        </div>
                    </b-row>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-tabs>
                <b-tab title="Behaviour" active>
                    <behaviour-diargam :series="seriesBehave" style="width: 800px"
                                       id="lvBehave"></behaviour-diargam>
                </b-tab>
                <b-tab title="Bifurcation">
                    <b-row>
                        <b-col sm="3">
                            <b-form-select :options="selectParameter" v-model="bifurcationParam"/>

                        </b-col>
                        <b-col sm="9" id="lvBifuraction">
                            <basic-chart-box id="bfId" :chart-options="bifurcationChartOptions"
                                             :series="seriesBifurcation" style="width: 800px"/>
                        </b-col>
                    </b-row>
                </b-tab>
            </b-tabs>
        </b-row>
        <div id="pdf"></div>
    </div>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from './diagrams/BehaviourDiargam'
    import LotkaVolterraControlPanel from './control-panel/LotkaVolterraControlPanel'
    import BasicChartBox from './diagrams/BasicChartBox'
    import {saveIdAsPdf} from "../assets/pdfUtils";

    export default {
        name: "LotkaVolterra",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam,
            BasicChartBox,
            LotkaVolterraControlPanel
        },
        data() {
            return {
                compareFlag: false,
                currentParams: null,
                dataPrey: [],
                compareDataPrey: [],
                dataPredator: [],
                compareDataPredator: [],
                dataBehave: [],
                dataBifurcation: [],
                timeArray: [],
                bifurcationChartOptions: {
                    title: {
                        text: "Bifurcation diagram"
                    },
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        x: {},
                        y: {}
                    },
                    legend: {
                        horizontalAlign: "left",
                        offsetX: 10
                    },
                    stroke: {
                        width: 1
                    },
                },
                chartOptions: {
                    title: {
                        text: 'Predator-prey population size'
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
                                text: "Prey population"
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
                                text: "Predator population"
                            }
                        }
                    ],
                    stroke: {
                        curve: "straight",
                        width: 1
                    },
                },
                series: [],
                seriesCompare: [],
                seriesBehave: [],
                seriesBifurcation: [],
                selectParameter: ['alpha', 'beta', 'gamma1', 'gamma2'],
                bifurcationParam: 'alpha',
                bifurcationStartValue: 0,
                bifurcationMaxValue: 10,
                bifurcationStep: 1
            }
        },
        methods: {
            onSeries(data) {
                this.series = data.series;
                this.currentParams = data.params;
            },
            onBehaviour(data) {
                this.seriesBehave = data
            },
            onBifurcation(data) {
                console.log(data)
                this.seriesBifurcation = data
            },
            onCompare(data) {
                this.compareFlag = true;
                this.seriesCompare.push(data);
                console.log(this.seriesCompare);
            },
            onSavePdf() {
                if (this.compareFlag) {
                    saveIdAsPdf(
                        "currentChart",
                        "test",
                        this.modelType,
                        this.currentParams,
                        "seriesCompare",
                        "lvBehave",
                        "bfId"
                    );
                } else {
                    saveIdAsPdf(
                        "currentChart",
                        "test",
                        this.modelType,
                        this.currentParams,
                        null,
                        "lvBehave",
                        "bfId"
                    );
                }
            }
        }
    }
</script>

<style>
    b-form-input {
        margin-bottom: 10px
    }
</style>