<template>
    <div id="experiment-jm">
        <b-row>
            <b-col sm="3">
                <b-row style="margin-left: 10px; margin-top: 5px;">
                    <b-form-select :options="params" style="margin-bottom: 20px"
                                   v-model="currentParam"/>
                    <b-row>
                        <b-col sm="6">
                            <label>Min</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input :state="checkRange(min, 0, 1000)"
                                          aria-describedby="input-msg-1" placeholder="Start value"
                                          type="number"
                                          v-model.number="min"/>
                            <b-form-invalid-feedback id="input-msg-1">
                                {{areaMsg(0, 1000)}}
                            </b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <label>Max</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input :state="checkRange(max, min, 1000)"
                                          aria-describedby="input-msg-2" placeholder="Max value"
                                          type="number"
                                          v-model.number="max"/>
                            <b-form-invalid-feedback id="input-msg-2">
                                {{areaMsg(min, 1000)}}
                            </b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <label>Step</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input :state="checkRange(step, min, max)"
                                          aria-describedby="input-msg-3" placeholder="step"
                                          type="number"
                                          v-model.number="step"/>
                            <b-form-invalid-feedback id="input-msg-3">
                                {{areaMsg(min, max)}}
                            </b-form-invalid-feedback>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="6">
                            <label>Time index</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input :state="checkRange(timeIndex, 0, 1000)"
                                          aria-describedby="input-msg-6" placeholder="Time index"
                                          type="number"
                                          v-model.number="timeIndex"/>
                            <b-form-invalid-feedback id="input-msg-6">
                                {{areaMsg(0, 1000)}}
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
                                Save pdf
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
                                     id="experiment-series-jm"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
                <b-row>
                    <basic-chart-box :chart-options="chartOptionsBehave" :series="seriesBehave"
                                     id="experiment-behave-jm"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
                <b-row>
                    <basic-chart-box :chart-options="chartOptionsBehave"
                                     :series="seriesParameterToX"
                                     id="experiment-param-jm"
                                     style="margin: 10px; width: 800px"/>
                </b-row>
            </b-col>
            <b-col id="experiment-table-jm"/>
        </b-row>
        <div id="pdf"/>
    </div>
</template>

<script>
    import BasicChartBox from '../../diagrams/BasicChartBox'
    import BehaviourDiargam from '../../diagrams/BehaviourDiargam'
    import {saveExperimentPdf} from "../../../assets/pdfUtils";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../../assets/xlsx_utils";

    export default {
        name: "JMonodComparisonTestModal",
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
            x: {
                type: Number
            },
            s: {
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
                timeIndex: 2,
                currentParam: '',
                min: 0.1,
                max: 0.7,
                step: 0.1,
                currentSeries: [],
                seriesBehave: [],
                seriesParameterToX: [],
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
                chartOptionsBehave: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    yaxis: {
                        title: {
                            text: "Nutrient",
                            style: {
                                color: "#883157",
                                fontSize: "14px"
                            }
                        }
                    },
                    xaxis: {
                        title: {
                            text: "Bacteria",
                            style: {
                                color: "#883157",
                                fontSize: "14px"
                            }
                        }
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

                dataX: [],
                dataS: [],
                paramX: [],
                paramS: [],
                series: []
            }
        },
        methods: {
            checkRange(value, min, max) {
                return value >= min && value <= max;
            },
            areaMsg(min, max) {
                return `Value should between ${min} and ${max}`
            },
            calculate() {
                this.series = [];
                this.seriesBehave = [];
                this.ev = [];
                this.equilibriumArray = [];
                this.paramX = [];
                this.paramS = [];
                for (let i = this.min; i < this.max; i += this.step) {
                    this.model[this.currentParam] = i;
                    if (this.currentParam === "s") {
                        this.s = i;
                    }
                    if (this.currentParam === "x") {
                        this.x = i;
                    }

                    this.calculateForTime(i);
                }

            },
            calculateForTime(ind) {
                let that = this;
                new Promise(resolve => {
                    let dataX = [];
                    let dataS = [];
                    let dataXtoS = [];

                    let xValue = that.x;
                    let sValue = that.s;

                    dataX.push([0, xValue]);
                    dataS.push([0, sValue]);

                    dataXtoS.push([xValue, sValue]);

                    for (let j = 0; j < that.time; j += that.timeStep) {
                        let res = that.model.calculateModel(xValue, sValue);

                        xValue += that.timeStep * res.dx;
                        sValue += that.timeStep * res.ds;

                        if (xValue <= 0 || sValue <= 0) {
                            break;
                        }

                        dataX.push([j, xValue]);
                        dataS.push([j, sValue]);
                        dataXtoS.push([xValue, sValue]);
                    }
                    resolve({x: dataX, s: dataS, xs: dataXtoS})
                }).then(result => {
                    this.series.push({
                        name: "Bacteria - " + ind,
                        data: result.x
                    });
                    this.series.push({
                        name: "Nutrient - " + ind,
                        data: result.s
                    });

                    this.seriesBehave.push({
                        name: "X to S - " + ind,
                        data: result.xs
                    });
                    this.paramX.push([ind, result.x[this.timeIndex][1]]);
                    this.paramS.push([ind, result.s[this.timeIndex][1]]);
                    this.seriesParameterToX = [
                        {
                            name: "Nutrient",
                            data: [...this.paramS]
                        },
                        {
                            name: "Bacteria",
                            data: [...this.paramX]
                        }
                    ]
                })
            },
            saveExperiment() {
                saveExperimentPdf(
                    this.model,
                    "experiment-series-jm",
                    "experiment-behave-jm",
                    "experiment-param-jm"
                );
            },
            saveExperimentXlsx() {
                let wb = createWorkbook();
                // add data prey
                for (let i = 0; i < this.series.length; i++) {
                    let data = [["Time", "Biomass"], this.series[i].data];
                    wb = createWorkSheet(wb, data, this.series[i].name);
                }
                // save
                saveWorkbook("chemostat", wb);
            }
        }
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

    .b-button {
        margin: 10px;
    }

    .row {
        margin-top: 10px;
    }

</style>