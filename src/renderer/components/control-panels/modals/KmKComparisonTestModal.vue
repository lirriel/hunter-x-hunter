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
                            <b-form-input max="1000.00" min="0.00" placeholder="Start value"
                                          step="0.0001"
                                          type="number"
                                          v-model.number="min"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="4">
                            <label>Max</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Max value"
                                          step="0.0001"
                                          type="number"
                                          v-model.number="max"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="4">
                            <label>Step</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                          step="0.000001"
                                          type="number"
                                          v-model.number="step"/>
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
                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
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
                    stroke: {
                        curve: "straight",
                        width: 1
                    },
                },

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
                this.dataS = [];
                this.dataI = [];
                this.dataR = [];

                let dataSToI = [];
                let is = [];
                let dataSToR = [];
                let dataIToR = [];

                let s = this.s;
                let i = this.i;
                let r = this.r;

                is.push([0, s + i + r]);
                is.push([s + i + r, 0]);

                this.dataS.push([0, s]);
                this.dataI.push([0, i]);
                this.dataR.push([0, r]);

                dataSToI.push([s, i]);
                dataSToR.push([s, r]);
                dataIToR.push([r, i]);

                for (let j = 0; j < this.time; j += this.timeStep) {
                    let res = this.model.calculateModel(s, i, r);

                    s += this.timeStep * res.ds;
                    i += this.timeStep * res.di;
                    r += this.timeStep * res.dr;

                    this.dataS.push([j, s]);
                    this.dataI.push([j, i]);
                    this.dataR.push([j, r]);

                    dataSToI.push([s, i]);
                    dataSToR.push([s, r]);
                    dataIToR.push([r, i]);

                    if (i === 0) {
                        break;
                    }
                }

                this.currentSeries.push({
                    name: "S - " + ind,
                    data: [...this.dataS]
                });
                this.currentSeries.push({
                    name: "I - " + ind,
                    data: [...this.dataI]
                });
                this.currentSeries.push({
                    name: "R - " + ind,
                    data: [...this.dataR]
                });

                this.phaseTrajSeries.push({
                    name: "Behave - I to S -" + ind,
                    data: [...dataSToI]
                });
                this.phaseTrajSeries.push({
                    name: "MAX - " + ind,
                    data: [...is]
                });

                this.seriesStoR.push({
                    name: "Behave - R to S - " + ind,
                    data: [...dataSToR]
                });
                this.seriesStoR.push({
                    name: "MAX - " + ind,
                    data: [...is]
                });

                this.seriesItoR.push({
                    name: "Behave - I to R -" + ind,
                    data: [...dataIToR]
                });
                this.seriesItoR.push({
                    name: "MAX - " + ind,
                    data: [...is]
                });

                this.drawPhaseTrajectories(ind);
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
                /*  if (this.model instanceof BasicSIR) {
                      for (let i = 0; i < this.dataSToI.length; i++) {
                          arr.push([
                              this.dataSToI[0],
                              this.model.getPhaseTrajectories(
                                  this.dataSToI[0], this.dataSToI[1]
                              )
                          ]);
                      }
                  }
                  this.phaseTrajSeries.push({
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
        border: 1px dashed #b9b9b7;
        border-radius: 2px;
        background-color: #fff;
        color: black;
    }

    b-button {
        margin: 10px;
    }

    th {
        background-color: #3672b9;
        color: rgba(255, 255, 255, 0.66);
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    td {
        background-color: white;
    }

    th, td {
        min-width: 100%;
        padding: 10px 10px;
        margin-left: 10px;
    }

    .col {
        margin-top: 5px;
    }
    .row {
        margin-top: 5px;
    }
</style>