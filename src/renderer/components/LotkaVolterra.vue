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
                            <basic-chart-box :chart-options="chartOptions" :series="series.series"/>
                        </b-col>
                        <div v-for="(s, ind) in seriesCompare" :key="ind"
                             v-if="compareFlag">
                            <b-col>
                                <basic-chart-box :chart-options="chartOptions" :series="s.series"
                                                 style="width: 600px;"/>
                            </b-col>
                        </div>
                    </b-row>
                </div>
            </b-col>
        </b-row>
        <behaviour-diargam :series="seriesBehave"></behaviour-diargam>
        <b-row>
            <b-col sm="3">
                <b-form-select :options="selectParameter" v-model="bifurcationParam"/>
                <b-row>
                    <b-col sm="4">
                        <label>Start value</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input max="1000.00" min="0.00" placeholder="Start value" step="0.01"
                                      type="number"
                                      v-model.number="bifurcationStartValue"/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4">
                        <label>Max value</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input max="1000.00" min="0.00" placeholder="Max value" step="0.01"
                                      type="number"
                                      v-model.number="bifurcationMaxValue"/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4">
                        <label>Step</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input max="1000.00" min="0.0000" placeholder="step" step="0.000001"
                                      type="number"
                                      v-model.number="bifurcationStep"/>
                    </b-col>
                </b-row>
                <!--<b-btn v-on:click="getBifurcationD">generate</b-btn>-->
            </b-col>
            <b-col sm="9">
                <basic-chart-box :chart-options="bifurcationChartOptions"
                                 :series="seriesBifurcation"/>
            </b-col>
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
                this.series = data
            },
            onBehaviour(data) {
                this.seriesBehave = data
            },
            onBifurcation(data) {
                this.seriesBifurcation = data
            },
            onCompare(data) {
                this.compareFlag = true;
                this.seriesCompare.push(data);
            },
            onSavePdf() {
                saveIdAsPdf("seriesCharts", "test")
            }
        }
    }
</script>

<style>


</style>