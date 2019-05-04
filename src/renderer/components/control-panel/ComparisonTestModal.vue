<template>
    <div id="experiment">
        <b-row>
            <b-col sm="3">
                <b-row style="margin-left: 10px; margin-top: 5px;">
                    <b-form-select :options="paramsArray" v-model="currentParam"
                                   style="margin-bottom: 20px"/>
                    <b-row>
                        <b-col sm="4">
                            <label>Min value</label>
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
                            <label>Max value</label>
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
                    <b-row>
                        <b-button v-on:click="calculate" variant="outline-primary">Calculate</b-button>
                        <b-button v-on:click="saveExperiment" variant="outline-primary">Save pdf</b-button>
                        <b-button v-on:click="saveExperimentXlsx" variant="outline-primary">Save table</b-button>
                    </b-row>
                </b-row>
            </b-col>
            <b-col>
                <b-row>
                    <basic-chart-box style="margin: 10px; width: 800px"
                                     :chart-options="chartOptions"
                                     :series="series"/>
                </b-row>
                <b-row>
                    <behaviour-diargam style="margin: 10px; width: 800px" :series="seriesBehave"/>
                </b-row>
            </b-col>

        </b-row>
        <b-row style="margin-left: 5px">
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
        </b-row>
    </div>
</template>

<script>
    import BasicChartBox from '../diagrams/BasicChartBox'
    import BehaviourDiargam from '../diagrams/BehaviourDiargam'
    import {saveExperimentPdf} from "../../assets/pdfUtils";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";

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
                    /*xaxis: {
                        title: {
                            text: "Time",
                            style: {
                                color: "#883157",
                                fontSize: "14px"
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: "Population size",
                            style: {
                                color: "#883157",
                                fontSize: "14px"
                            }
                        }
                    },*/
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
            calculate() {
                this.currentSeries = [];
                this.seriesBehave = [];
                this.ev = [];
                this.equilibriumArray = [];

                for (let i = this.min; i < this.max; i += this.step) {
                    this.model[this.currentParam] = i;
                    console.log(this.model[this.currentParam] + " " + this.model.a);
                    this.calculateForTime(i);
                }
                console.log(this.currentSeries);
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

                    this.dataPrey.push([i, x]);
                    this.dataPredator.push([i, y]);
                    dataBehave.push([x, y])
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
                // let t = [];
                // let d = [];
                for (let i = 0; i < eq.length; i++) {
                    let el = eq[i];
                    let q = this.model.jacobian(el[0], el[1]);
                    // t.push(q);
                    // d.push(this.model.jacobianAnalysis(q));
                    this.equilibriumArray.push({
                        paramValue: ind,
                        eqPoint: [...el],
                        jacobianMatrix: [...q],
                        stability: this.model.jacobianAnalysis(q)
                    })
                }
            },
            saveExperiment() {
                saveExperimentPdf("experiment", this.model);
            },
            saveExperimentXlsx() {
                var wb = createWorkbook();
                // add data prey
                var data = Array.from(this.equilibriumArray);
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

    th {
        background-color: #42b983;
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