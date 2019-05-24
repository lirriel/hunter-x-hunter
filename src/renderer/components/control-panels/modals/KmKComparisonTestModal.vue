<template>
    <div id="experiment-kmk">
        <b-row>
            <b-col sm="3">
                <b-row style="margin-left: 10px; margin-top: 5px;">
                    <b-form-select :options="params" style="margin-bottom: 20px"
                                   v-model="currentParam"/>
                    <b-row>
                        <b-col sm="4">
                            <label>Min</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input :state="checkRange(min, 0, 1000)"
                              aria-describedby="input-msg-1" max="1000.00" min="0.00" placeholder="Start value"
                                          step="0.0001"
                                          type="number"
                                          v-model.number="min"/>
                        <b-form-invalid-feedback id="input-msg-1">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="4">
                            <label>Max</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input :state="checkRange(max, min, 1000)"
                              aria-describedby="input-msg-2" max="1000.00" min="0.00" placeholder="Max value"
                                          step="0.0001"
                                          type="number"
                                          v-model.number="max"/>
                        <b-form-invalid-feedback id="input-msg-2">
                        {{areaMsg(min, 1000)}}
                    </b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="4">
                            <label>Step</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input :state="checkRange(step, min, max)"
                              aria-describedby="input-msg-6" max="1000.00" min="0.0000" placeholder="step"
                                          step="0.000001"
                                          type="number"
                                          v-model.number="step"/>
                        <b-form-invalid-feedback id="input-msg-6">
                        {{areaMsg(min, max)}}
                    </b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                    <b-col>
                        <b-row>
                            <b-button v-on:click="calculate" variant="outline-primary">
                                <i class="fas fa-calculator"></i>
                                Calculate
                            </b-button>
                        </b-row>
                        <b-row>
                            <b-button v-on:click="saveExperiment" variant="outline-danger">
                                <i class="far fa-file-pdf"/>
                                Save Pdf
                            </b-button>
                        </b-row>
                        <b-row>
                            <b-button v-on:click="saveExperimentXlsx" variant="outline-success">
                                <i class="fas fa-file-excel"></i>
                                Save Data
                            </b-button>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
            <b-col>
                <b-row>
                    <basic-chart-box :chart-options="chartOptions"
                                     :series="series"
                                     id="experiment-series-kmk"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
                <b-row>
                    <basic-chart-box :chart-options="chartOptionsSI"
                                     :series="phaseTrajSeries"
                                     id="experiment-behave-kmk-s-i"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
                <b-row>
                    <basic-chart-box :chart-options="chartOptionsSR"
                                     :series="seriesStoR"
                                     id="experiment-behave-kmk-s-r"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
                <b-row>
                    <basic-chart-box :chart-options="chartOptionsRI"
                                     :series="seriesItoR"
                                     id="experiment-behave-kmk-i-r"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
            </b-col>
        </b-row>
        <b-row id="experiment-table" style="margin-left: 5px">
            <b-row>
                <h3>Changing parameter {{currentParam}}</h3>
            </b-row>
            <br>
            <b-row style="margin-top: 10px">
                <table>
                    <thead>
                    <th>Susceptible</th>
                    <th>Infected</th>
                    <th>Recovered</th>
                    <th>Chance to be infected</th>
                    <th>Chance to be recovered</th>
                    <th>return to infected</th>
                    <th>basicReproductionNumber</th>
                    <th>Message</th>
                    </thead>
                    <tbody>
                    <tr v-for="e in info">
                        <td v-for="el in e">{{el}}</td>
                    </tr>
                    </tbody>
                </table>
            </b-row>
        </b-row>
    </div>
</template>

<script>
    import BasicChartBox from '../../diagrams/BasicChartBox'
    import BehaviourDiargam from '../../diagrams/BehaviourDiargam'
    import {saveExperimentPdf} from "../../../assets/pdfUtils";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../../assets/xlsx_utils";
    import {KermackMakKendrickSIS} from "../../../assets/kermackMakKendrick";
    import {sirChartOptions} from "../../../assets/simulation/predatorPreyChartOptions";

    export default {
        name: "KmKComparisonTestModal",
        components: {
            BasicChartBox,
            BehaviourDiargam
        },
        props: {
            params: {
                type: Array
            },
            model: {
                type: Object
            },
            i: {
                type: Number
            },
            s: {
                type: Number
            },
            r: {
                type: Number
            },
            time: {
                type: Number
            },
            timeStep: {
                type: Number
            }
        },
        data() {
            return {
                currentParam: '',
                paramsArray: [],
                min: 0.1,
                max: 0.7,
                step: 0.1,
                currentSeries: [],
                seriesBehave: [],
                equilibriumArray: [],
                equilibrium: {
                    paramValue: 0,
                    eqPoint: [],
                    jacobianMatrix: [],
                    stability: '',
                },
                ev: {
                    value: 0,
                    ev: [],
                    jac: [],
                    descr: []
                },
                info: [],
                chartOptions: sirChartOptions,

                chartOptionsSR: null,
                chartOptionsSI: null,
                chartOptionsRI: null,

                dataS: [],
                dataI: [],
                dataR: [],

                series: [],
                seriesStoR: [],
                seriesItoR: [],
                phaseTrajSeries: []
            }
        },
        methods: {
            checkRange(value, min, max) {
                return value >= min && value <= max;
            },
            areaMsg(min, max) {
                return `Value should between ${min} and ${max}`
            },
            load() {
                this.chartOptionsRI = copyObject(this.chartOptions);
                this.chartOptionsSI = copyObject(this.chartOptions);
                this.chartOptionsSR = copyObject(this.chartOptions);

                this.chartOptionsRI.xaxis = this.getAxis("Recovered");
                this.chartOptionsRI.yaxis = this.getAxis("Infected");

                this.chartOptionsSI.xaxis = this.getAxis("Susceptible");
                this.chartOptionsSI.yaxis = this.getAxis("Infected");

                this.chartOptionsSR.xaxis = this.getAxis("Susceptible");
                this.chartOptionsSR.yaxis = this.getAxis("Recovered");

                this.chartOptions.yaxis = this.getAxis("Time");
                this.chartOptions.xaxis = this.getAxis("Group size");
            },
            calculate() {
                this.load();
                this.currentSeries = [];
                this.seriesBehave = [];
                this.seriesStoR = [];
                this.seriesItoR = [];
                this.ev = [];
                this.info = [];
                this.equilibriumArray = [];
                this.phaseTrajSeries = [];

                for (let i = this.min; i < this.max; i += this.step) {
                    this.model[this.currentParam] = i;
                    if (this.currentParam === "S") {
                        this.s = i;
                    }
                    if (this.currentParam === "I") {
                        this.i = i;
                    }
                    if (this.currentParam === "R") {
                        this.r = i;
                    }
                    this.info.push([
                        this.s,
                        this.i,
                        this.r,
                        this.model.b,
                        this.model.q,
                        this.model.m,
                        this.model.getBasicReproductionNumber(this.s),
                        this.getMessage()
                    ]);
                    this.calculateForTime(i);
                }
                this.series = this.currentSeries;
            },
            calculateForTime(ind) {
                let that = this;
                new Promise(resolve => {
                    let dataS = [];
                    let dataI = [];
                    let dataR = [];

                    let dataSToI = [];
                    let isMax = [];
                    let dataSToR = [];
                    let dataIToR = [];

                    let s = that.s;
                    let i = that.i;
                    let r = that.r;

                    isMax.push([0, s + i + r]);
                    isMax.push([s + i + r, 0]);

                    dataS.push([0, s]);
                    dataI.push([0, i]);
                    dataR.push([0, r]);

                    dataSToI.push([s, i]);
                    dataSToR.push([s, r]);
                    dataIToR.push([r, i]);

                    for (let j = 0; j < that.time; j += that.timeStep) {
                        let res = that.model.calculateModel(s, i, r);

                        s += that.timeStep * res.ds;
                        i += that.timeStep * res.di;
                        r += that.timeStep * res.dr;

                        if (s <= 0 || i <= 0 || r <= 0) {
                            break;
                        }

                        dataS.push([j, s]);
                        dataI.push([j, i]);
                        dataR.push([j, r]);

                        dataSToI.push([s, i]);
                        dataSToR.push([s, r]);
                        dataIToR.push([r, i]);

                        if (i === 0) {
                            break;
                        }
                        resolve({
                            s: dataS,
                            i: dataI,
                            r: dataR,
                            si: dataSToI,
                            sr: dataSToR,
                            ir: dataIToR,
                            max: isMax
                        })
                    }
                }).then(result => {
                    this.currentSeries.push({
                        name: "S - " + ind,
                        data: result.s
                    });
                    this.currentSeries.push({
                        name: "I - " + ind,
                        data: result.i
                    });
                    this.currentSeries.push({
                        name: "R - " + ind,
                        data: result.r
                    });

                    this.phaseTrajSeries.push({
                        name: "Behave - I to S -" + ind,
                        data: result.si
                    });
                    this.phaseTrajSeries.push({
                        name: "MAX - " + ind,
                        data: result.max
                    });

                    this.seriesStoR.push({
                        name: "Behave - R to S - " + ind,
                        data: result.sr
                    });
                    this.seriesStoR.push({
                        name: "MAX - " + ind,
                        data: result.max
                    });

                    this.seriesItoR.push({
                        name: "Behave - I to R -" + ind,
                        data: result.ir
                    });
                    this.seriesItoR.push({
                        name: "MAX - " + ind,
                        data: result.max
                    });
                    this.drawPhaseTrajectories(ind);
                })
            },
            saveExperiment() {
                saveExperimentPdf(this.model, "experiment-series-kmk",
                    "experiment-behave-kmk", "experiment-table-kmk");
            },
            saveExperimentXlsx() {
                let wb = createWorkbook();
                // data.splice(0, 0, ["Parameter", "Equilibrium point", "Jacobian Matrix", "Stability"]);
                wb = createWorkSheet(wb, this.info, "epidemic");
                saveWorkbook("epidemic model", wb);
            },
            drawPhaseTrajectories(ind) {
                let arr = [];
                if (this.model instanceof BasicSIR) {
                    for (let i = 0; i < this.dataSToI.length; i++) {
                        arr.push([
                            this.dataSToI[0],
                            this.model.getPhaseTrajectories(
                                this.dataSToI[0], this.dataSToI[1]
                            )
                        ]);
                    }
                }
                /*this.phaseTrajSeries.push({
                    data: arr,
                    name: "phase trajectories - " + ind
                });*/

            },
            getAxis(txt) {
                let o = {
                    title: {
                        text: txt,
                        style: {
                            color: "#883157",
                            fontSize: "14px"
                        }
                    },
                    labels: {
                        formatter: function (value) {
                            return parseFloat(value).toFixed(2)
                        }
                    }
                };
                return copyObject(o);
            },
            getMessage() {
                let msg = this.model.getAnalysis(this.s, this.i, 0.05);
                msg += ". Epidemological Threshold Analysis: "
                    + this.model.getEpidemicThresholdAnalysis(this.s);
                if (this.model instanceof KermackMakKendrickSIS) {
                    msg += ". Spread analysis of SIS: "
                        + this.model.spreadAnalysis(this.s);
                }
                return msg;
            },
        }
    }

    function copyObject(o) {
        return JSON.parse(JSON.stringify(o));
    }
</script>

<style scoped>
    table {
        width: 100%;
    }

    th, td {
        padding: 15px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }

    b-button {
        margin: 10px;
    }

    .col {
        margin-top: 5px;
    }

    .row {
        margin-top: 5px;
    }
</style>