<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-form-select :options="lvModelTypes" v-model="currentType" style="margin-bottom: 20px"/>

        <div v-if="isLotkaVolterra">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="experimentLotkaVolterra.prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="experimentLotkaVolterra.predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Prey birth rate (Alpha)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Alpha" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.alpha"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Impact of predation (Gamma 1)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Gamma 1" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.gamma1"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator Death rate (Beta)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Beta" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.beta"></b-form-input>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Growth in predator (Gamma 2)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Gamma 2" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.gamma2"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraContTime">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="experimentLotkaVolterraContTime.prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="experimentLotkaVolterraContTime.predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(r)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  v-model.number="experimentLotkaVolterraContTime.r"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(k)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.k"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(a)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.a"/>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(c)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.c"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(b)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.b"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(d)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.d"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isRosenzweigMacArthur">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="experimentRosenzweigMacArthur.prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="experimentRosenzweigMacArthur.predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(k)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  v-model.number="experimentRosenzweigMacArthur.k"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(m)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentRosenzweigMacArthur.m"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(c)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentRosenzweigMacArthur.c"/>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div style="margin-top: 10px">
            <b-button v-on:click="calculateLotkaVolterra" variant="outline-primary">
                Calculate
            </b-button>
            <b-button v-on:click="saveData" variant="outline-primary">
                Save
            </b-button>
            <b-button v-on:click="savePdf" variant="outline-primary">Save Pdf</b-button>
            <b-button v-on:click="compare" variant="outline-warning">
                Compare
            </b-button>
        </div>
    </div>
</template>

<script>
    import {
        lotkaVolterra,
        lotkaVolterraContiniousTime,
        rosenzweigMacArthur
    } from "../../assets/lotkaVolterra";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";

    export default {
        name: "LotkaVolterraControlPanel",
        data() {
            return {
                lvModelTypes: [
                    'Lotka-Volterra',
                    'Lotka-Volterra with continuous time',
                    'Rosenzweig and MacArthur model'
                ],
                currentType: 'Lotka-Volterra',
                experimentLotkaVolterra: {
                    prey: 20,
                    predator: 3,
                    alpha: 0.9,
                    gamma1: 0.3,
                    beta: 0.6,
                    gamma2: 0.06,
                    K: 0.56,
                    r: 0.56,
                },
                time: 10,
                timeStep: 0.1,
                experimentLotkaVolterraContTime: {
                    prey: 20,
                    predator: 3,
                    r: 0.6,
                    k: 126,
                    a: 0.6,
                    c: 0.06,
                    b: 0.56,
                    d: 0.56,
                },
                experimentRosenzweigMacArthur: {
                    prey: 1,
                    predator: 1,
                    k: 3,
                    m: 2,
                    c: 4
                },
                compareFlag: false,
                dataPrey: [],
                compareDataPrey: [],
                dataPredator: [],
                compareDataPredator: [],
                dataBehave: [],
                dataBifurcation: [],
                timeArray: [],
                series: [],
                seriesCompare: [],
                seriesBehave: [],
                seriesBifurcation: [],
                selectParameter: ['alpha', 'beta', 'gamma1', 'gamma2'],
                bifurcationParam: 'alpha',
                bifurcationStartValue: 0,
                bifurcationMaxValue: 10,
                bifurcationStep: 1,
                isLotkaVolterra: true,
                isLotkaVolterraContTime: false,
                isRosenzweigMacArthur: false
            }
        },
        watch: {
          currentType: function (data) {
              this.isRosenzweigMacArthur = this.isLotkaVolterra = this.isLotkaVolterraContTime = false;
              if (data === this.lvModelTypes[0]) {
                  this.isLotkaVolterra = true;
              }
              if (data === this.lvModelTypes[1]) {
                  this.isLotkaVolterraContTime = true;
              }
              if (data === this.lvModelTypes[2]) {
                  this.isRosenzweigMacArthur = true;
              }
          }
        },
        methods: {
            calculateLotkaVolterra() {
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
                this.$emit('series', {series: this.series, params: this.experimentLotkaVolterra});
                this.seriesBehave = [
                    {
                        name: "Behaviour",
                        data: this.dataBehave
                    },
                    {
                        name: "Equilibrium Points",
                        type: 'scatter',
                        data: [[0, 0],
                            // [this.alpha / this.gamma1, this.beta / this.gamma2]
                        ]
                    }
                ];
                this.$emit('behaviour', this.seriesBehave);
            },
            calculateForTime(t) {
                this.dataPrey = [];
                this.dataPredator = [];
                this.dataBehave = [];

                let x = this.prey;
                let y = this.predator;

                this.dataPrey.push([0, x]);
                this.dataPredator.push([0, y]);
                this.dataBehave.push([y, x]);

                for (let i = this.timeStep; i < t; i += this.timeStep) {
                    let res;
                    if (this.isLotkaVolterra) {
                        res = lotkaVolterra(x, y,
                            this.experimentLotkaVolterra.alpha,
                            this.experimentLotkaVolterra.gamma1,
                            this.experimentLotkaVolterra.beta,
                            this.experimentLotkaVolterra.gamma2);
                    } else if (this.isLotkaVolterraContTime) {
                        res = lotkaVolterraContiniousTime(x, y,
                            this.experimentLotkaVolterraContTime.r,
                            this.experimentLotkaVolterraContTime.k,
                            this.experimentLotkaVolterraContTime.a,
                            this.experimentLotkaVolterraContTime.c,
                            this.experimentLotkaVolterraContTime.b,
                            this.experimentLotkaVolterraContTime.d);
                    } else if (this.isRosenzweigMacArthur) {
                        res = rosenzweigMacArthur(x, y,
                            this.experimentRosenzweigMacArthur.k,
                            this.experimentRosenzweigMacArthur.m,
                            this.experimentRosenzweigMacArthur.c)
                    }
                    // let res = rosenzweigMacArthur(x, y, this.gamma1, this.alpha, this.beta);
                    // let res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, 0.6, 0.56);
                    // let res = lotkaVolterraContiniousTime(x, y, 1.6, 125, this.alpha, this.gamma1, this.beta, this.gamma2);
                    // default x=y=20

                    x = x + this.timeStep * res.prey;
                    y = y + this.timeStep * res.predator;

                    this.dataPrey.push([i, x]);
                    this.dataPredator.push([i, y]);

                    this.dataBehave.push([y, x])
                }
                // console.log(this.dataPrey)
            },
            getBifurcationD() {
                this.dataBifurcation = [];
                var x = this.prey;
                var y = 0;
                for (var i = this.bifurcationStartValue; i <= this.bifurcationMaxValue; i += this.bifurcationStep) {
                    var res = {prey: 0, predator: 0};
                    if (this.bifurcationParam === 'alpha') {
                        res = rosenzweigMacArthur(x, y, this.gamma1, i, this.beta);
                        // res = lotkaVolterra(x, 0, i, this.gamma1, this.beta, this.gamma2);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, i, 50, 0.6, 0.56);
                    } else if (this.bifurcationParam === 'beta') {
                        res = lotkaVolterra(x, 0, this.alpha, this.gamma1, i, this.gamma2);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, i, 0.6, 0.56);
                    } else if (this.bifurcationParam === 'gamma1') {
                        res = lotkaVolterra(x, 0, this.alpha, i, this.beta, this.gamma2);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, i, 0.56);
                    } else if (this.bifurcationParam === 'gamma2') {
                        res = lotkaVolterra(x, 0, this.alpha, this.gamma1, this.beta, i);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, 0.6, i);
                    }
                    x = x + res.prey;
                    this.dataBifurcation.push([i, x])
                }
                this.seriesBifurcation = [{
                    name: "Bifrucation " + this.bifurcationParam,
                    data: this.dataBifurcation
                }];
                this.$emit('bifurcation', this.seriesBifurcation)
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
            compare() {
                this.compareDataPrey = Array.from(this.dataPrey);
                this.compareDataPredator = Array.from(this.dataPredator);
                this.compareFlag = true;
                this.seriesCompare = [
                    {
                        name: "Prey population",
                        data: this.compareDataPrey
                    },
                    {
                        name: "Predator population",
                        data: this.compareDataPredator
                    }
                ];
                this.$emit('compare', this.seriesCompare)
            },
            savePdf() {
                this.$emit('savePdf', true)
            }
        }
    }
</script>

<style scoped>

</style>