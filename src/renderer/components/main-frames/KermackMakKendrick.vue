<template>
    <div>
        <h2>Kermack-MakKendrick model</h2>
        <b-row>
            <b-col sm="3">
                <kermack-mac-kendrick-controller
                        @behaveCurve="onBehaveCurve"
                        @epidemicInfo="onEpidemicInfo"
                        @message="onmessage"
                        @model="onModelChanged"
                        @addToChart="addToChart"
                        @removeChart="removeChart"
                        @r0="onR"
                        @series="onSeries"
                        @seriesBehave="onSeriesBehave"/>
                <div class="shadow p-3 mb-5 bg-white rounded" v-if="msg.length > 0">
                    <h6>Initial value analysis: {{msg}}</h6>
                </div>
                <div class="shadow p-3 mb-5 bg-white rounded" v-if="r0 != 0">
                    <h6>Basic reproduction number : {{r0.toFixed(2)}}</h6>
                </div>
            </b-col>
            <b-col sm="9">
                <div>
                    <basic-chart-box :chart-options="chartOptions" :series="series.series"
                                     id="kmkSeries"/>
                </div>
            </b-col>
        </b-row>
        <vs-divider/>
        <b-row>
            <b-tabs style="width: 100%">
                <b-tab active title="Behaviour">
                    <div class="inside-tab">
                        <behaviour-diargam :series="seriesBehave.series" id="kmkBehave"
                                           style="width: 900px; margin-left: 30px; margin-top: 20px"/>
                    </div>
                </b-tab>
                <b-tab title="Behave curve" v-if="behaveCurveFlag">
                    <div class="inside-tab">
                        <basic-chart-box :chart-options="chartOptions"
                                         :series="seriesBehaveCurve"
                                         id="kmkBehaveCurve"
                                         style="width: 900px"/>
                    </div>
                </b-tab>
                <b-tab title="Epidemic points info">
                    <div class="inside-tab">
                        <div class="shadow p-3 mb-5 bg-white rounded">
                            <label v-if="info.peak !== [-1,-1]">Infection peak:
                                {{round(info.peak)}}</label>
                            <br>
                            <br>
                            <label>Recovery Threshold: {{round(info.recoverThreshold)}}</label>
                            <br>
                            <br>
                            <label>Outbreak Threshold: {{round(info.outbreakThreshold)}}</label>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Customize">
                    <div class="inside-tab">
                        <calculate-custom-parameters
                                :input-model="currentModel"/>
                    </div>
                </b-tab>
            </b-tabs>
        </b-row>
    </div>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from '../diagrams/BehaviourDiargam'
    import KermackMacKendrickController from '../control-panels/KermackMacKendrickController'
    import BasicChartBox from '../diagrams/BasicChartBox'
    import {roundArray} from "../../assets/pdfUtils";
    import CalculateCustomParameters from '../CalculateCustomParameters'
    import {BasicSIR} from "../../assets/kermackMakKendrick";
    import {sirChartOptions} from "../../assets/simulation/predatorPreyChartOptions";

    export default {
        name: "KermackMakKendrick",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam,
            KermackMacKendrickController,
            BasicChartBox,
            CalculateCustomParameters
        },
        data() {
            return {
                currentParams: {},
                r0: 0,
                chartOptions: sirChartOptions,
                series: [],
                seriesBehave: [],
                seriesBehaveCurve: [],
                behaveCurveFlag: false,
                currentModel: new BasicSIR(0, 0),
                msg: '',
                info: {},
                comparedSeries: []
            }
        },
        methods: {
            onSeries(data) {
                this.series = data;
                if (this.comparedSeries.length >0 ){
                    for (let i = 0; i < this.comparedSeries.length; i++) {
                        this.series.series.push(this.comparedSeries[i])
                    }
                }
            },
            onSeriesBehave(data) {
                this.seriesBehave = data;
            },
            onBehaveCurve(data) {
                this.behaveCurveFlag = data.flag;
                this.seriesBehaveCurve = data.series;
            },
            addToChart(data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].name += " - 1"
                }
                this.comparedSeries = data;
            },
            removeChart() {
                if (this.comparedSeries.length > 0) {
                    this.series.series = this.series.series.slice(0, 3);
                    this.comparedSeries = []
                }
            },
            onmessage(data) {
                this.msg = data;
            },
            onModelChanged(data) {
                this.currentModel = data.model;
            },
            onR(data) {
                this.r0 = data;
            },
            onEpidemicInfo(data) {
                this.info = data;
            },
            round(ar) {
                return roundArray(ar);
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