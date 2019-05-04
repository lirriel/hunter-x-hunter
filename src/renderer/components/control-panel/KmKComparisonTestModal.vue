<template>
    <div id="experiment-kmk">
        <b-row>
            <b-col sm="3">
                <b-row style="margin-left: 10px; margin-top: 5px;">
                    <b-form-select :options="params" v-model="currentParam"
                                   style="margin-bottom: 20px"/>
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
                    <b-button v-on:click="calculate" variant="outline-primary">
                        Calculate
                    </b-button>
                    <b-button v-on:click="saveExperiment" variant="outline-primary">
                        Save pdf
                    </b-button>
                    <b-button v-on:click="saveExperimentXlsx" variant="outline-primary">
                        Save table
                    </b-button>
                </b-row>
            </b-col>
            <b-col>
                <b-row>
                    <basic-chart-box style="margin: 10px; width: 800px"
                                     :chart-options="chartOptions"
                                     :series="series"
                                     id="experiment-series-kmk"/>
                </b-row>
                <b-row>
                    <behaviour-diargam id="experiment-behave-kmk" style="margin: 10px; width: 800px"
                                       :series="seriesBehave"/>
                </b-row>
            </b-col>

        </b-row>
        <!--<b-row style="margin-left: 5px" id="experiment-table">
            <b-row>
                <h3>Changing parameter {{currentParam}}</h3>
            </b-row>
            <br>
            <b-row style="margin-top: 10px">
                <table>
                    <thead>
                    <th>Parameter value</th>
                    <th>Equilibrium point</th>
                    <th>Jacobian matrix</th>
                    <th>Stability</th>
                    </thead>
                    <tbody>
                    <tr v-for="e in equilibriumArray">
                        <td>{{e.paramValue}}</td>
                        <td>{{e.eqPoint}}</td>
                        <td>
                            <table>
                                <tbody>
                                <tr v-for="entry in e.jacobianMatrix">
                                    <td v-for="key in entry">
                                        {{key}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>{{e.stability}}</td>
                    </tr>
                    </tbody>
                </table>
            </b-row>
        </b-row>-->
    </div>
</template>

<script>
    import BasicChartBox from '../diagrams/BasicChartBox'
    import BehaviourDiargam from '../diagrams/BehaviourDiargam'
    import {saveExperimentPdf} from "../../assets/pdfUtils";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";

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

                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    legend: {
                        position: 'top',
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
                    stroke: {
                        curve: "straight",
                        width: 1
                    },
                },

                dataS: [],
                dataI: [],
                dataR: [],

                series: []
            }
        },
        watch: {
            params: function (data) {
                // console.log("params")
                // console.log(this.paramsArray)
                // this.paramsArray = Object.keys(data)
            },
        },
        methods: {
            calculate() {
                this.currentSeries = [];
                this.seriesBehave = [];
                this.ev = [];
                this.equilibriumArray = [];

                for (let i = this.min; i < this.max; i += this.step) {
                    this.model[this.currentParam] = i;
                    this.calculateForTime(i);
                }
                this.series = this.currentSeries;
            },
            calculateForTime(ind) {
                this.dataS = [];
                this.dataI = [];
                this.dataR = [];

                let dataSToI = [];
                let dataSToR = [];
                let dataIToR = [];

                let s = this.s;
                let i = this.i;
                let r = this.r;

                this.dataS.push([0, s]);
                this.dataI.push([0, i]);
                this.dataR.push([0, r]);

                for (let j = 0; j < this.time; j += this.timeStep) {
                    let res = this.model.calculateModel(s, i, r);

                    s += this.timeStep * res.ds;
                    i += this.timeStep * res.di;
                    r += this.timeStep * res.dr;

                    this.dataS.push([j, s]);
                    this.dataI.push([j, i]);
                    this.dataR.push([j, r]);

                    dataSToI.push([i, s]);
                    dataSToR.push([r, s]);
                    dataIToR.push([r, i]);
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
                this.seriesBehave.push({
                    name: "Behave - " + ind,
                    data: [...dataSToI]
                });
                let eq = this.model.getEquilibrium();

                // for (let i = 0; i < eq.length; i++) {
                //     let el = eq[i];
                //     let q = this.model.jacobian(el[0], el[1]);
                //     this.equilibriumArray.push({
                //         paramValue: ind,
                //         eqPoint: [...el],
                //         jacobianMatrix: [...q],
                //         stability: this.model.jacobianAnalysis(q)
                //     })
                // }
            },
            saveExperiment() {
                saveExperimentPdf(this.model);
            },
            saveExperimentXlsx() {
                let wb = createWorkbook();
                // add data prey
                let data = [];
                this.equilibriumArray.forEach(function (el) {
                    data.push([
                        el.paramValue,
                        el.eqPoint,
                        [el.jacobianMatrix],
                        el.stability
                    ]);
                });
                console.log(data);
                data.splice(0, 0, ["Parameter", "Equilibrium point", "Jacobian Matrix", "Stability"]);
                wb = createWorkSheet(wb, data, "stability");
                // save
                saveWorkbook("test", wb);
            }
        }
    }
</script>

<style scoped>
    table {
        border: 1px solid #42b983;
        border-radius: 3px;
        background-color: #fff;
        color: black;
    }

    .b-button {
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
        min-width: 120px;
        padding: 10px 20px;
    }

</style>