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
        <b-col id="experiment-table" style="margin-left: 5px">
            <b-row>
                <h2>Changing parameter {{currentParam}}</h2>
            </b-row>
            <b-row style="margin-top: 40px; margin-left: 10px">
                <table>
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
                            <table class="table-1">
                                <tbody>
                                <tr v-for="entry in e.jacobianMatrix">
                                    <td v-for="key in round(entry)">
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
        </b-col>
    </div>
</template>

<script>
    import BasicChartBox from '../../diagrams/BasicChartBox'
    import BehaviourDiargam from '../../diagrams/BehaviourDiargam'
    import {saveExperimentPdf} from "../../../assets/pdfUtils";
    import {
        createWorkbook,
        createWorkSheet,
        saveWorkbook,
        checkNan
    } from "../../../assets/xlsx_utils";
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
                let that = this;
                new Promise(resolve => {
                    let dataPrey = [];
                    let dataPredator = [];
                    let dataBehave = [];

                    let x = that.prey;
                    let y = that.predator;

                    dataPrey.push([0, x]);
                    dataPredator.push([0, y]);
                    dataBehave.push([x, y]);

                    for (let i = 0; i < that.time; i += that.timeStep) {
                        let res = that.model.calculateModel(x, y);
                        x += that.timeStep * res.prey;
                        y += that.timeStep * res.predator;

                        dataPrey.push([i, checkNan(x)]);
                        dataPredator.push([i, checkNan(y)]);
                        dataBehave.push([checkNan(x), checkNan(y)])
                    }
                    resolve({prey: dataPrey, predator: dataPredator, behave: dataBehave})
                }).then(result => {
                    this.currentSeries.push({
                        name: "Prey population - " + ind,
                        data: result.prey
                    });
                    this.currentSeries.push({
                        name: "Predator population - " + ind,
                        data: result.predator
                    });
                    this.seriesBehave.push({
                        name: "Behave - " + ind,
                        data: result.behave
                    });
                    let eq = this.model.getEquilibrium();
                    for (let i = 0; i < eq.length; i++) {
                        let el = eq[i];
                        let q = this.model.jacobian(el[0], el[1]);
                        console.log(q);
                        this.equilibriumArray.push({
                            paramValue: ind,
                            eqPoint: [...el],
                            jacobianMatrix: [...q],
                            stability: this.model.jacobianAnalysis(q)
                        })
                    }
                })
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
    b-button {
        margin: 10px;
    }

    table {
        width: 100%;
    }

    th, td {
        padding: 15px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }

    .col {
        margin-top: 5px;
    }

    .row {
        margin-top: 5px;
    }

</style>