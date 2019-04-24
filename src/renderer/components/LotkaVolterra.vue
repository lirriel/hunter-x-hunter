<template>
    <div>
        <h2>Lotka-Volterra model</h2>
        <b-row>
            <b-col sm="3">
                <div>
                    <b-row>
                        <b-col sm="4">
                            <label>Prey</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input placeholder="Prey" type="number" v-model.number="prey"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Predator</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input placeholder="Predator" type="number" v-model.number="predator"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Prey birth rate (Alpha)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Alpha" step="0.01"
                                          type="number"
                                          v-model.number="alpha"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Impact of predation (Gamma 1)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Gamma 1" step="0.01"
                                          type="number"
                                          v-model.number="gamma1"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Predator Death rate (Beta)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Beta" step="0.01" type="number"
                                          v-model.number="beta"></b-form-input>
                        </b-col>

                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Growth in predator (Gamma 2)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Gamma 2" step="0.01"
                                          type="number"
                                          v-model.number="gamma2"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Time</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01" type="number"
                                          v-model.number="time"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Time step</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                          step="0.00000001"
                                          type="number"
                                          v-model.number="timeStep"></b-form-input>
                        </b-col>
                    </b-row>
                    <div style="margin-top: 10px">
                        <b-button v-on:click="calculateLotkaVolterra" variant="outline-primary">
                            Calculate
                        </b-button>
                        <b-button v-on:click="saveData" variant="outline-primary">
                            Save
                        </b-button>
                    </div>
                </div>
            </b-col>
            <b-col sm="9">
                <div>
                    <apexchart :options="chartOptions" :series="series" type="area" width="700"></apexchart>
                </div>
            </b-col>
        </b-row>
        <behaviour-diargam :series="seriesBehave"></behaviour-diargam>
        <b-row>
            <b-col sm="3">
                <b-form-select :options="selectParameter" v-model="bifurcationParam"></b-form-select>
                <b-row>
                    <b-col sm="4">
                        <label>Start value</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input max="1000.00" min="0.00" placeholder="Start value" step="0.01"
                                      type="number"
                                      v-model.number="bifurcationStartValue"></b-form-input>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4">
                        <label>Max value</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input max="1000.00" min="0.00" placeholder="Max value" step="0.01"
                                      type="number"
                                      v-model.number="bifurcationMaxValue"></b-form-input>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4">
                        <label>Step</label>
                    </b-col>
                    <b-col sm="8">
                        <b-form-input max="1000.00" min="0.00" placeholder="step" step="0.01"
                                      type="number"
                                      v-model.number="bifurcationStep"></b-form-input>
                    </b-col>
                </b-row>
                <b-btn v-on:click="getBifurcationD">generate</b-btn>
            </b-col>
            <b-col sm="9">
                <h3>Bifurcation diagram</h3>
                <div>
                    <apexchart :options="chartOptions" :series="seriesBifurcation" type="line" width="700"></apexchart>
                </div>
            </b-col>
        </b-row>
<!--        <b-row>-->
<!--            <b-btn v-on:click="drawCanvas">Draw</b-btn>-->
<!--            <canvas height="300" id="c" width="500"></canvas>-->
<!--        </b-row>-->
    </div>
</template>

<script>
    import {lotkaVolterra, lotkaVolterraContiniousTime} from "../assets/lotkaVolterra";
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from './BehaviourDiargam'
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../assets/xlsx_utils";

    export default {
        name: "LotkaVolterra",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam
        },
        data() {
            return {
                prey: 20,
                predator: 50,
                alpha: 3.2,
                gamma1: 50,
                beta: 0.6,
                gamma2: 0.56,
                K: 0.56,
                r: 0.56,
                time: 100,
                timeStep: 0.1,
                dataPrey: [],
                dataPredator: [],
                dataBehave: [],
                dataBifurcation: [],
                timeArray: [],
                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        x: { },
                             y: {}
                    },
                    // stroke: {
                    //     curve: "smooth"
                    // },
                },
                series: [],
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
            calculateLotkaVolterra() {
                const result = lotkaVolterra(this.prey, this.predator, this.alpha, this.beta, this.gamma1, this.gamma2);
                this.calculateForTime(this.time);
                this.series = [
                    {
                        name: "Prey population",
                        data: this.dataPrey
                    },
                    {
                        name: "Predator population",
                        data: this.dataPredator
                    }
                ];
                this.seriesBehave = [
                    {
                        name: "Behaviour",
                        data: this.dataBehave
                    }
                ]
            },
            calculateForTime(t) {
                var dataPrey = [];
                var dataPredator = [];
                var dataBehave = [];

                let x = this.prey;
                let y = this.predator;

                dataPrey.push([0, x]);
                dataPredator.push([0, y]);
                dataBehave.push([y, x]);

                for (let i = this.timeStep; i < t; i += this.timeStep) {
                    // let res = lotkaVolterra(x, y, this.alpha, this.beta, this.gamma1, this.gamma2);
                    // let res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, 0.6, 0.56);
                    let res = lotkaVolterraContiniousTime(x, y, 1.6, 125, this.alpha, this.gamma1, this.beta, this.gamma2);
                    // default x=y=20

                    x = x + this.timeStep * res.prey;
                    y = y + this.timeStep * res.predator;

                    dataPrey.push([i, x]);
                    dataPredator.push([i, y]);

                    dataBehave.push([y, x])
                }
                this.dataPrey = dataPrey;
                this.dataPredator = dataPredator;
                this.dataBehave = dataBehave;
            },
            getBifurcationD() {
                this.dataBifurcation = [];
                var x = this.prey;
                var y = 0;
                for (var i = this.bifurcationStartValue; i <= this.bifurcationMaxValue; i += this.bifurcationStep) {
                    var res = {prey: 0, predator: 0};
                    if (this.bifurcationParam === 'alpha') {
                        // res = lotkaVolterra(x, 0, i, this.beta, this.gamma1, this.gamma2);
                        res = lotkaVolterraContiniousTime(x, y, 1.6, 125, i, 50, 0.6, 0.56);
                    } else if (this.bifurcationParam === 'beta') {
                        // res = lotkaVolterra(x, 0, this.alpha, i, this.gamma1, this.gamma2);
                        res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, i, 0.6, 0.56);
                    } else if (this.bifurcationParam === 'gamma1') {
                        // res = lotkaVolterra(x, 0, this.alpha, this.beta, i, this.gamma2);
                        res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, i, 0.56);
                    } else if (this.bifurcationParam === 'gamma2') {
                        // res = lotkaVolterra(x, 0, this.alpha, this.beta, this.gamma1, i);
                        res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, 0.6, i);
                    }
                    x = x + res.prey;
                    this.dataBifurcation.push([i, x])
                }
                this.seriesBifurcation = [{
                    name: "Bifrucation " + this.bifurcationParam,
                    data: this.dataBifurcation
                }]
            },
            saveData() {
                var wb = createWorkbook();
                // add data prey
                var data = Array.from(this.dataPrey);
                data.splice(0, 0, ["prey amount", "time"]);
                wb = createWorkSheet(wb, data, "prey");
                // add dataI
                data = Array.from(this.dataPredator);
                data.splice(0, 0, ["predator amount", "time"]);
                wb = createWorkSheet(wb, data, "predator");
                // save
                saveWorkbook("test", wb);
            },
            drawCanvas() {
                var beta = this.beta;
                var gamma1 = this.gamma1;
                var gamma2 = this.gamma2;
                var data = this;
                var c = document.getElementById("c"),
                    ctx = c.getContext("2d"),
                    w = c.width,
                    h = c.height,
                    st = 2 / w,
                    fx = function (x1, r) {
                        return r * x1 * (1 - x1) * Math.sin(x1) ;
                    },
                    it = function (r, data) {
                        var idx = 0,
                            x = 20,
                            // xc = w * ((r - 2) / 2);
                            xc = w * lotkaVolterra(x, 0, r, data.beta, data.gamma1, data.gamma2).prey;
                        while (idx++ < 10000) {
                            // x = x + lotkaVolterra(x, 0, r, data.beta, data.gamma1, data.gamma2).prey;
                            x = fx(x, r);
                            ctx.fillRect(xc, h - (x * h), 1, 1);
                        }
                    };
                ctx.fillStyle = "rgba(55,101,255,0.72)";
                for (var r = 2; r < 4; r += st) {
                    (function (r1) {
                        setTimeout(function () {
                            it(r1, data);
                        }, 0);
                    })(r);
                }
                console.log("done")
            }
        }
    }
</script>

<style lang="sass" scoped>
    svg
        margin: 25px

        path
            fill: none
            stroke: #76BF8A
            stroke-width: 1px

        .path-predator
            stroke: lightcoral

        .path-prey
            stroke: gold

        .chart
        width: 100%
</style>