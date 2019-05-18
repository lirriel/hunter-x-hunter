<template>
    <div id="page">
        <h2>Lotka-Volterra model</h2>
        <b-row>
            <b-col sm="4">
                <lotka-volterra-control-panel @addToChart="addToChart"
                                              @behaviour="onBehaviour"
                                              @compare="onCompare"
                                              @model="onModelChanged"
                                              @removeChart="removeChart"
                                              @savePdf="onSavePdf"
                                              @series="onSeries"
                />
            </b-col>
            <b-col id="seriesCharts" sm="8">
                <div>
                    <b-row>
                        <b-col>
                            <basic-chart-box :chart-options="chartOptions" :series="series"
                                             id="currentChart"
                                             style="width: 1000px"/>

                        </b-col>
                    </b-row>
                    <b-row>
                        <div id="seriesCompare"
                             v-for="s in seriesCompare" v-if="compareFlag">
                            <b-col>
                                <label style="font-color: gray">{{s.params}}</label>
                                <basic-chart-box :chart-options="chartOptions"
                                                 :series="s.series"
                                                 style="width: 600px"/>
                            </b-col>
                        </div>
                    </b-row>
                </div>
            </b-col>
        </b-row>
        <vs-divider/>
        <b-row>
            <b-tabs style="width: 100%;">
                <b-tab active title="Behaviour">
                    <div class="inside-tab">
                        <behaviour-diargam :series="seriesBehave" id="lvBehave"
                                           style="width: 800px"></behaviour-diargam>

                    </div>
                </b-tab>
                <b-tab title="Bifurcation">
                    <div class="inside-tab">
                        <b-row v-if="currentParams">
                            <b-col sm="3">
                                <b-form-checkbox v-model="isPreyBifurcation">
                                    Is Prey Evaluated
                                </b-form-checkbox>
                                <br><br>
                                <b-form-select :options="Object.keys(currentModel)"
                                               v-model="bifurcationParam"/>
                                <vs-input label="Start value" placeholder="0" type="number"
                                          v-model.number="bifurcationStartValue"/>
                                <vs-input label="Max value" placeholder="0" type="number"
                                          v-model.number="bifurcationMaxValue"/>
                                <vs-input label="Step" placeholder="0" type="number"
                                          v-model.number="bifurcationStep"/>
                                <b-button v-on:click="getBifurcationD" variant="outline-primary">
                                    <i class="fas fa-puzzle-piece"></i>
                                    Generate
                                </b-button>
                            </b-col>
                            <b-col id="lvBifuraction" sm="9">
                                <basic-chart-box :chart-options="bifurcationChartOptions"
                                                 :series="seriesBifurcation"
                                                 id="bfId" style="width: 800px"/>
                            </b-col>
                        </b-row>
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
        <div id="pdf"></div>
    </div>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from '../diagrams/BehaviourDiargam'
    import LotkaVolterraControlPanel from '../control-panels/LotkaVolterraControlPanel'
    import BasicChartBox from '../diagrams/BasicChartBox'
    import {saveIdAsPdf} from "../../assets/pdfUtils";
    import {predatorPreyChartOptions} from "../../assets/simulation/predatorPreyChartOptions";
    import CalculateCustomParameters from '../CalculateCustomParameters'
    import {BasicLotkaVolterra} from "../../assets/lotkaVolterra";

    export default {
        name: "LotkaVolterra",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam,
            BasicChartBox,
            LotkaVolterraControlPanel,
            CalculateCustomParameters
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
                    xaxis: {
                        labels: {
                            formatter: function (value) {
                                return parseFloat(value).toFixed(2)
                            }
                        },
                        title: {
                            text: this.bifurcationParam
                        }
                    },
                    yaxis: [{
                        labels: {
                            formatter: function (value) {
                                return parseFloat(value).toFixed(2)
                            }
                        },
                        title: {
                            text: "Prey"
                        }
                    }],
                    legend: {
                        horizontalAlign: "left",
                        offsetX: 10
                    },
                    stroke: {
                        width: 1
                    },
                },
                chartOptions: predatorPreyChartOptions,
                series: [],
                seriesCompare: [],
                seriesBehave: [],
                seriesBifurcation: [],
                bifurcationParam: '',
                bifurcationStartValue: 0,
                bifurcationMaxValue: 10,
                bifurcationStep: 1,
                isPreyBifurcation: true,
                currentModel: new BasicLotkaVolterra(0, 0, 0, 0),
                predator: 0,
                prey: 0,
                comparedSeries: []
            }
        },
        watch: {
            isPreyBifurcation: function (data) {
                if (data === true) {
                    this.bifurcationChartOptions.yaxis[0].title.text = "Prey"
                } else {
                    this.bifurcationChartOptions.yaxis[0].title.text = "Predator"
                }
            }
        },
        methods: {
            onSeries(data) {
                this.series = data.series;
                if (this.comparedSeries.length > 0) {
                    this.series.push(this.comparedSeries[0]);
                    this.series.push(this.comparedSeries[1]);
                    console.log(this.series)
                }
                this.currentParams = data.params;
            },
            onBehaviour(data) {
                this.seriesBehave = data
            },
            onCompare(data) {
                this.compareFlag = true;
                this.seriesCompare.push(data);
            },
            onModelChanged(data) {
                this.currentModel = data.model;
                this.predator = data.predator;
                this.prey = data.prey;
            },
            getBifurcationD() {
                let dataBifurcation = [];
                let curModel = this.currentModel;
                var x = this.prey;
                var y = this.predator;
                for (let i = this.bifurcationStartValue; i <= this.bifurcationMaxValue; i += this.bifurcationStep) {
                    curModel[this.bifurcationParam] = i;
                    let res = curModel.calculateModel(x, y);
                    if (this.isPreyBifurcation === true) {
                        x += res.prey;
                        dataBifurcation.push([i, x]);
                    } else {
                        y += res.predator;
                        dataBifurcation.push([i, y]);
                    }
                }
                this.seriesBifurcation = [{
                    name: "Bifurcation " + this.bifurcationParam,
                    data: dataBifurcation
                }];
            },
            addToChart(data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].name += " - 1"
                }
                this.comparedSeries = data;
            },
            removeChart() {
                if (this.comparedSeries.length > 0) {
                    this.series = this.series.slice(0, 2);
                    this.comparedSeries = []
                }
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
        font-family: 'Karla', sans-serif;
        margin-bottom: 10px
    }

    .b-button {
        margin-top: 10px;
    }

    .inside-tab {
        margin-top: 20px;
        margin-left: 30px;
    }
</style>