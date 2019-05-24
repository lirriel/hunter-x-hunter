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
                                <vs-input label="Opacity" max="1" min="0.01" placeholder="0"
                                          type="number"
                                          v-model.number="opacity"/>
                                <vs-input label="Indexes" max="100" min="2000" placeholder="0"
                                          type="number"
                                          v-model.number="indexes"/>
                                <!--<b-button v-on:click="getBifurcationD" variant="outline-primary">-->
                                <b-button v-on:click="drawB" variant="outline-primary">
                                    <i class="fas fa-puzzle-piece"></i>
                                    Generate
                                </b-button>
                                <b-button v-on:click="saveB" variant="outline-danger">
                                    <i class="far fa-file-pdf"></i>
                                    Save pdf
                                </b-button>
                            </b-col>
                            <b-col id="lvBifuraction" sm="9">
                                <canvas height="620" id="c" width="850"></canvas>
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
    import {saveIdAsPdf, saveBifurcationDiargam} from "../../assets/pdfUtils";
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
                bdType: "scatter",
                compareFlag: false,
                currentParams: null,
                dataPrey: [],
                compareDataPrey: [],
                dataPredator: [],
                compareDataPredator: [],
                dataBehave: [],
                dataBifurcation: [],
                timeArray: [],
                indexes: 10,
                bifurcationChartOptions: {
                    type: 'scatter',
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
                            show: false,
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
                        width: 0.01
                    },
                },
                chartOptions: predatorPreyChartOptions,
                series: [],
                seriesCompare: [],
                seriesBehave: [],
                seriesBifurcation: [],
                bifurcationParam: 'a',
                opacity: 0.2,
                bifurcationStartValue: 0.1,
                bifurcationMaxValue: 1,
                bifurcationStep: 0.1,
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
            drawB() {
                startDraw(this)
            },
            saveB() {
                var who = "prey";
                if (this.isPreyBifurcation == false) {
                    who = "predator"
                }
                var msg = "Changing parameter " + this.bifurcationParam + " in a range ["
                    + this.bifurcationStartValue + ", " + this.bifurcationMaxValue + "] for " + who
                + " population. ";
                saveBifurcationDiargam(msg, this.currentModel)
            },
            onSeries(data) {
                this.series = data.series;
                if (this.comparedSeries.length > 0) {
                    this.series.push(this.comparedSeries[0]);
                    this.series.push(this.comparedSeries[1]);
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
            }
            ,
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

    function startDraw(that) {
        let curModel = Object.assign(Object.create(Object.getPrototypeOf(that.currentModel)), that.currentModel);
        var bd = [];
        var xMax = 0;
        var c = document.getElementById("c"),
            ctx = c.getContext("2d"),
            dw = 50,
            w = c.width - dw,
            dh = 20,
            h = c.height - dh,
            st = (that.bifurcationMaxValue - that.bifurcationStartValue) / w,
            b = 0.4,
            c1 = 0.4,
            d = 0.2,
            fx = function (x1, r, y1) {
                return [r * x1 * (1 - x1) - x1 * (b * y1), y1 * (c1 * x1 - d)];
            },
            it = function (r) {
                curModel[that.bifurcationParam] = r;
                var idx = 0,
                    x = that.prey,
                    y = that.predator,
                    xc = w * ((r - that.bifurcationStartValue) / (that.bifurcationMaxValue - that.bifurcationStartValue));
                while (idx++ < that.indexes) {
                    let res = curModel.calculateModel(x, y);
                    x += res.prey;
                    y += res.predator;
                    if (x <= 0 || y <= 0) {
                        break;
                    }
                    var t = x;
                    if (that.isPreyBifurcation === false) {
                        t = y;
                    }
                    if (t * h > xMax) {
                        xMax = t * h;
                    }
                    bd.push([xc, t * h])
                }
                if (xc >= (w-1)) {
                    var xt = 0.001;
                    if (xMax > h) {
                        xt = h/xMax;
                    } else {
                        xt = xMax/h;
                    }
                    ctx.clearRect(0, 0, w + dw, h + dh);
                    ctx.fillStyle = "rgba(32,64,128," + that.opacity + ")";
                    for (let i = 0; i < bd.length; i++) {
                        ctx.fillRect(bd[i][0] + dw, h - (xt * bd[i][1]), 1, 1);
                    }
                    ctx.moveTo(dw, h);
                    ctx.lineTo(w + dw, h);
                    ctx.stroke();

                    ctx.moveTo(dw, h);
                    ctx.lineTo(dw, 0);
                    ctx.stroke();

                    ctx.fillStyle = "rgba(7, 47, 95, 2)";
                    ctx.font = "20px Arial";
                    ctx.fillText(xMax.toFixed(2), 1, 20);
                    ctx.fillText(that.bifurcationChartOptions.yaxis[0].title.text, 1, h/2);
                    ctx.fillText(0, dw, h + dh);
                    ctx.fillText(that.bifurcationParam, w/2, h + dh);
                    ctx.fillText(that.bifurcationMaxValue, w - 30, h + dh);
                }
            };
        ctx.fillStyle = "rgba(32,64,128," + that.opacity + ")";
        ctx.clearRect(0, 0, w, h);
        for (let r = that.bifurcationStartValue; r <= that.bifurcationMaxValue; r += st) {
            (function (r1) {
                setTimeout(function () {
                    it(r1);
                }, 0);
            })(r);
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

    .vs-input{
        margin-bottom: 10px;
    }

    .inside-tab {
        margin-top: 20px;
        margin-left: 30px;
    }
</style>