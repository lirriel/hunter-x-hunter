<template>
    <div id="experiment">
        <b-row>
            <b-col sm="3">
                <b-row style="margin-left: 10px; margin-top: 5px;">
                    <b-form-select :options="paramsArray" style="margin-bottom: 20px"
                                   v-model="currentParam"/>
                    <b-row>
                        <b-col sm="5">
                            <label>Min</label>
                        </b-col>
                        <b-col sm="7">
                            <b-form-input max="1000.00" min="0.00" placeholder="Start value"
                                          step="0.0001"
                                          type="number"
                                          v-model.number="min"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="5">
                            <label>Max</label>
                        </b-col>
                        <b-col sm="7">
                            <b-form-input max="1000.00" min="0.00" placeholder="Max value"
                                          step="0.0001"
                                          type="number"
                                          v-model.number="max"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="5">
                            <label>Step</label>
                        </b-col>
                        <b-col sm="7">
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
                                     id="experiment-series"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
                <b-row>
                    <behaviour-diargam :series="seriesBehave" id="experiment-behave"
                                       style="margin: 10px; width: 800px"/>
                </b-row>
            </b-col>

        </b-row>
        <b-row id="experiment-table" style="margin-left: 5px">
            <b-row>
                <h2>Changing parameter {{currentParam}}</h2>
            </b-row>
            <br><br>
            <br><br>
            <b-row style="margin-top: 40px; margin-left: 10px">
                <table width="800px">
                    <thead>
                    <th>Parameter value</th>
                    <th>Equilibrium point</th>
                    <th>Jacobian matrix</th>
                    <th>Stability</th>
                    </thead>
                    <tbody>
                    <tr v-for="e in equilibriumArray">
                        <td>{{e.paramValue.toFixed(2)}}</td>
                        <td>{{round(e.eqPoint)}}</td>
                        <td>
                            <table style="margin-left: 8px">
                                <tbody>
                                <tr v-for="entry in e.jacobianMatrix">
                                    <td v-for="key in entry" v-if="key">
                                        {{key.toFixed(2)}}
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
        </b-row>
    </div>
</template>

<script>
    import BasicChartBox from '../../diagrams/BasicChartBox'
    import BehaviourDiargam from '../../diagrams/BehaviourDiargam'
    import {saveExperimentPdf} from "../../../assets/pdfUtils";
    import {createWorkbook, createWorkSheet, saveWorkbook, checkNan} from "../../../assets/xlsx_utils";
    import {roundArray} from "../../../assets/pdfUtils";

    export default {
        name: "ComparisonTestModal",
        components: {
            BasicChartBox,
            BehaviourDiargam
        },
        props: {
            params: {
                type: Object
            },
            model: {
                type: Object
            },
            prey: {
                type: Number
            },
            predator: {
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
                dataPrey: [],
                dataPredator: [],
                series: []
            }
        },
        watch: {
            params: function (data) {
                this.paramsArray = Object.keys(data)
            },
        },
        methods: {
            round(ar) {
                return roundArray(ar)
            },
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
                this.dataPrey = [];
                this.dataPredator = [];
                let dataBehave = [];

                let x = this.prey;
                let y = this.predator;

                this.dataPrey.push([0, x]);
                this.dataPredator.push([0, y]);
                dataBehave.push([x, y]);

                for (let i = 0; i < this.time; i += this.timeStep) {
                    let res = this.model.calculateModel(x, y);
                    x += this.timeStep * res.prey;
                    y += this.timeStep * res.predator;

                    this.dataPrey.push([i, checkNan(x)]);
                    this.dataPredator.push([i, checkNan(y)]);
                    dataBehave.push([checkNan(x), checkNan(y)])
                }
                this.currentSeries.push({
                    name: "Prey population - " + ind,
                    data: [...this.dataPrey]
                });
                this.currentSeries.push({
                    name: "Predator population - " + ind,
                    data: [...this.dataPredator]
                });
                this.seriesBehave.push({
                    name: "Behave - " + ind,
                    data: [...dataBehave]
                });
                let eq = this.model.getEquilibrium();
                for (let i = 0; i < eq.length; i++) {
                    let el = eq[i];
                    let q = this.model.jacobian(el[0], el[1]);
                    this.equilibriumArray.push({
                        paramValue: ind,
                        eqPoint: [...el],
                        jacobianMatrix: [...q],
                        stability: this.model.jacobianAnalysis(q)
                    })
                }
            },
            saveExperiment() {
                saveExperimentPdf(this.model, "experiment-series", "experiment-behave", "experiment-table");
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