<template>
    <div style="margin-bottom: 100px">
        <b-button style="width: 100%" v-b-toggle.collapse variant="outline-info">
            Comparison experiment
        </b-button>
        <b-collapse id="collapse" invisible>
            <b-card>
                <b-row style="margin-left: 10px">
                    <vs-select label="Model property"
                               v-model="currentParam"
                    >
                        <vs-select-item :key="i" :text="item" :value="item"
                                        v-for="(item, i) in Object.keys(simulationParams)"/>
                    </vs-select>
                </b-row>
                <vs-divider/>
                <b-row style="margin-top: 20px;">
                    <b-col>
                        <vs-input label="Start value" placeholder="0" type="number" v-model="min"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Max value" placeholder="1" type="number" v-model="max"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Step" placeholder="1" type="number" v-model="step"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Prey min count" placeholder="1" type="number"
                                  v-model="preyMinCount"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Prey max count" placeholder="1" type="number"
                                  v-model="preyMaxCount"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Number of ticks" placeholder="1" type="number"
                                  v-model="maxTick"/>
                    </b-col>
                </b-row>
                <vs-divider/>
                <b-row style="padding-top: 10px">
                    <b-col sm="4">
                        <b-button v-on:click="start" variant="outline-primary">
                            <i class="fas fa-play"/>
                            Start
                        </b-button>
                        <b-button style="margin-left: 10px" v-on:click="savePdf"
                                  variant="outline-primary">
                            <i class="far fa-file-pdf"/>
                            Save pdf
                        </b-button>
                        <b-button style="margin-left: 10px" v-on:click="saveXlsx"
                                  variant="outline-primary">
                            <i class="fas fa-file-excel"/>
                            Save data
                        </b-button>
                    </b-col>
                </b-row>
                <vs-divider/>
                <b-row style="margin: 5px;" v-if="showSpinner">
                    <b-spinner label="Spinning" type="grow"/>
                </b-row>
                <vs-divider v-if="showSpinner"/>
                <b-row id="gameHumanExp" v-if="!showSpinner">
                    <b-col :key="ind" v-for="(value, ind) in valueArray">
                        <label>{{currentParam}} = {{value}}</label>
                        <br>
                        <label>Longest period = {{maxTimeBetweenValues[ind][0]}}, </label>
                        <label>Overall period = {{maxTimeBetweenValues[ind][1]}}</label>
                        <basic-chart-box :chart-options="chartOptions" :series="seriesArray[ind]"
                                         style="width: 700px"/>
                    </b-col>
                </b-row>
                <vs-divider/>
                <b-row>
                    <label style="margin: 0 auto"><-- Calculate for min-max evaluation --></label>
                </b-row>
                <vs-divider/>
                <b-col>
                    <b-row>
                        <vs-input label="Minimum time threshold" placeholder="0" size="small"
                                  type="number" v-model="maxTimeThreshold"/>
                    </b-row>
                    <vs-divider/>
                    <b-row>
                        <b-col :key="i" v-for="(p, i) in params">
                            <b-form-checkbox v-model="p.active">
                                {{p.name}}
                            </b-form-checkbox>
                            <div v-if="p.active">
                                <vs-input label="Min" placeholder="0" type="number"
                                          v-model="p.min"/>
                                <vs-input label="Max" placeholder="0" type="number"
                                          v-model="p.max"/>
                                <vs-input label="Step" placeholder="0" type="number"
                                          v-model="p.step"/>
                            </div>
                        </b-col>
                    </b-row>
                    <vs-divider/>
                    <b-row>
                        <b-button v-on:click="getHumanInteractionEvaluation"
                                  variant="outline-warning"><i class="fas fa-play"></i>
                            Start experiment
                        </b-button>
                        <b-button style="margin-left: 20px" v-on:click="stopExperiment"
                                  variant="outline-danger"><i class="fas fa-random"></i>
                            Stop running
                        </b-button>
                        <b-button style="margin-left: 20px" v-on:click="saveTableData"
                                  variant="outline-success"><i class="fas fa-file-excel"></i>
                            Save results table
                        </b-button>
                    </b-row>
                    <vs-divider/>
                    <b-row>
                        <b-progress :max="experimentMaxCount" height="40px" style="width: 100%">
                            <b-progress-bar :max="experimentMaxCount" :value="experimentCount"
                                            variant="info">
                                Progress: <strong>{{ experimentCount}} /
                                {{experimentMaxCount}}</strong>
                            </b-progress-bar>
                        </b-progress>
                    </b-row>
                </b-col>
                <vs-divider/>
                <b-row style="color:#000;">
                    <b-table :fields="fields" :items="items" hover/>
                </b-row>
                <b-row v-if="isExperimentFinished">
                    <b-col sm="3">
                        <vs-input label="Chart id" placeholder="0" type="number"
                                  v-model="getChartInd"/>
                    </b-col>
                    <b-col style="margin-top: 10px">
                        <b-button style="height: 40px; margin-top: 20px"
                                  v-on:click="getSeriesHuman(getChartInd)"
                                  variant="outline-primary">
                            <i class="far fa-chart-bar"></i>
                            Get chart
                        </b-button>
                        <b-button style="margin-left: 10px; height: 40px; margin-top: 20px"
                                  v-on:click="saveChartData(getChartInd)"
                                  variant="outline-success"><i class="fas fa-file-excel"></i>
                            Save chart data
                        </b-button>
                    </b-col>
                </b-row>
                <b-row v-if="isExperimentFinished">
                    <b-row style="margin-top: 10px">
                        <basic-chart-box :chart-options="chartOptions" :series="experimentSeries"
                                         id="experimentHumanChart"
                                         style="width: 1000px"/>
                    </b-row>
                </b-row>
                <div id="pdf"></div>
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
    import Grid from './Grid.vue';
    import BasicChartBox from "../diagrams/BasicChartBox"
    import {Person} from "../../assets/simulation/Person";
    import {Predator} from "../../assets/simulation/Predator";
    import {Prey} from "../../assets/simulation/Prey";
    import {saveSimulationExperimentPdf} from "../../assets/pdfUtils";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";
    import {simulationParams} from "../../assets/simulation/simulationParams";
    import {predatorPreyChartOptions} from "../../assets/simulation/predatorPreyChartOptions";

    export default {
        name: "SimulationExperiment",
        components: {
            'app-grid': Grid,
            BasicChartBox
        },
        props: {
            simulationParams: {
                type: Object,
                default: simulationParams
            }
        },
        watch: {
            simulationParams: function (data) {
                // todo: workaround
                this.showSpinner = false;
            }
        },
        data() {
            return {
                showSpinner: false,
                paramsArray: [],
                currentParam: 'preyBirthPeriod',
                min: 1,
                max: 5,
                step: 1,
                seriesArray: [],
                valueArray: [],
                message: '',
                isRunning: false,

                maxTick: 16,

                /////////////////////////
                preyMinCount: 10,
                preyMaxCount: 20,
                preyPercent: 0.3,
                preyPercentDivergence: 20,
                ///////////////////////////

                //////////////////////////////////////////////////////////////////////
                organisms: [],
                organismsGrid: [],

                // Stats that get passed down to the app-stats component
                currentTick: 0,
                cellCount: 0,
                cellsAlive: 0,
                cellsCreated: 0,

                // A prop that gets used by the app-cell component (drag)
                isMouseDown: true,

                isHumanRequired: true,

                ////////////////////////////////////////////
                series: [],
                seriesBehave: [],
                dataBehave: [],
                dataPrey: [],
                dataPredator: [],

                /////////////////////////////////
                chartOptions: predatorPreyChartOptions,
                params: [
                    {name: "killPredatorPriority", min: 0.1, max: 1, step: 0.1, active: false},
                    {name: "killPreyPriority", min: 0.1, max: 1, step: 0.1, active: false},
                    {
                        name: "killRange",
                        min: 1,
                        max: 7,
                        // max: Math.max(this.simulationParams.width, this.simulationParams.height),
                        step: 1,
                        // step: Math.max(this.simulationParams.width, this.simulationParams.height) / 10
                        active: false
                    },
                    {
                        name: "noticeOrganismRange",
                        min: 5,
                        max: 6,
                        // max: Math.max(this.simulationParams.width, this.simulationParams.height),
                        step: 1,
                        // step: Math.max(this.simulationParams.width, this.simulationParams.height) / 10
                        active: false
                    },
                    {name: "preyNeedLimit", min: 4, max: 5, step: 1, active: false},
                    {name: "preyNeedStepsLimit", min: 4, max: 5, step: 1, active: false}
                ],
                maxTimeBetweenValues: [],
                experimentHuman: [],
                experimentMaxCount: 0,
                experimentSeries: [],
                experimentCount: 0,
                experimentRun: false,
                getChartInd: 0,
                isExperimentFinished: false,
                maxTimeOverall: [],
                maxTimeThreshold: 5,

                items: [],
                fields: {
                    index: {
                        label: 'index',
                        sortable: true
                    },
                    killPredatorPriority: {
                        label: 'killPredatorPriority',
                        sortable: true
                    },
                    killPreyPriority: {
                        label: 'killPreyPriority',
                        sortable: true
                    },
                    killRange: {
                        label: 'killRange',
                        sortable: true
                    },
                    noticeOrganismRange: {
                        label: 'noticeOrganismRange',
                        sortable: true
                    },
                    preyNeedLimit: {
                        label: 'preyNeedLimit',
                        sortable: true
                    },
                    preyNeedStepsLimit: {
                        label: 'preyNeedStepsLimit',
                        sortable: true
                    },
                    maxOverallTime: {
                        label: 'maxOverallTime',
                        sortable: true
                    },
                    longestMax: {
                        label: 'longestMax',
                        sortable: true
                    }
                },
            }
        },
        mounted() {
            let opt = {
                show: false,
                seriesName: 'Prey population'
            };
            this.chartOptions.yaxis.push(opt, opt)
        },
        methods: {
            saveTableData() {
                var wb = createWorkbook();
                var data = [Object.keys(this.fields)];
                for (let i = 0; i < this.items.length; i++) {
                    data.push(Object.values(this.items[i]));
                }
                wb = createWorkSheet(wb, data, "human-interaction-threshold" + this.maxTimeThreshold);
                data = [Object.keys(this.simulationParams), Object.values(this.simulationParams)];
                wb = createWorkSheet(wb, data, "original-params");
                saveWorkbook("humanInteractionExperiment", wb);
            },
            saveChartData(ind) {
                var wb = createWorkbook();
                for (let j = 0; j < this.seriesArray[ind].length; j++) {
                    var series = this.seriesArray[ind][j];
                    var data = Array.from(series.data);
                    data.splice(0, 0, [series.name, "time"]);
                    wb = createWorkSheet(wb, data, series.name + "_" + i + "");
                }
                saveWorkbook("predatorPreySimulationExperiment", wb);
            },
            stopExperiment() {
                this.experimentRun = false;
                this.experimentSeries = this.experimentHuman = [];
                this.experimentMaxCount = this.experimentCount = 0;
                this.isExperimentFinished = true;
            },
            start() {
                this.showSpinner = true;
                this.valueArray = [];
                this.seriesArray = [];
                this.maxTimeBetweenValues = [];

                for (let i = this.min; i < this.max; i += this.step) {
                    this.valueArray.push(i);
                    this.getPromise().then(result => {
                        result.push({
                            name: "Prey min",
                            type: "area",
                            data: [[0, this.preyMinCount], [this.maxTick, this.preyMinCount]]
                        });
                        result.push({
                            name: "Prey max",
                            type: "area",
                            data: [[0, this.preyMaxCount], [this.maxTick, this.preyMaxCount]]
                        });
                        this.maxTimeBetweenValues.push([
                            this.getMaxTimeBetween(result[0].data, this.preyMinCount, this.preyMaxCount),
                            this.getOverallTimeBetween(result[0].data, this.preyMinCount, this.preyMaxCount)
                        ]);
                        this.seriesArray.push([...result])
                    })
                }
                this.showSpinner = false;
            },
            getMaxTimeBetween(arr, min, max) {
                let t = 0;
                let maxT = 0;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i][1] >= min && arr[i][1] <= max) {
                        t++;
                        if (t > maxT) {
                            maxT = t;
                        }
                    } else {
                        t = 0;
                    }
                }
                return maxT;
            },
            getSeriesHuman(ind) {
                this.experimentSeries = this.experimentHuman[ind];
            },
            getOverallTimeBetween(arr, min, max) {
                return arr.filter(function (el) {
                    return el[1] >= min && el[1] <= max;
                }).length;
            },
            getPromise(i) {
                let getParamsFunc = this.getSimulationParams;
                let rndSeed = this.randomSeed;
                let upd = this.update;
                let tick = this.maxTick;
                return new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        let p = getParamsFunc(i);
                        let dataPrey = [];
                        let dataPredator = [];
                        let organisms = [];
                        organisms = rndSeed(p, organisms);
                        for (let j = 0; j < tick; j++) {
                            let update = upd(organisms, p);
                            dataPrey.push([j, update[0]]);
                            dataPredator.push([j, update[1]]);
                        }
                        let series = [
                            {name: "Prey population", data: dataPrey},
                            {name: "Predator population", data: dataPredator}
                        ];
                        resolve(series);
                    }, 1000);
                })
            },
            getHumanInteractionEvaluation() {
                this.experimentRun = true;
                this.isExperimentFinished = false;
                this.maxTimeOverall = [];
                this.items = [];
                this.experimentCount = 0;
                this.experimentMaxCount = 1;
                for (let q = 0; q < this.params.length; q++) {
                    if (this.params[q].active === true) {
                        this.experimentMaxCount *= (this.params[q].max - this.params[q].min + this.params[q].step) / this.params[q].step
                    }
                }
                this.getRecParams(0, []);
            },
            getRecParams(i, paramsArr) {
                if (i === this.params.length - 1) {
                    runSimulationExperiment.call(this, this.simulationParams, [...paramsArr]);
                    return;
                }
                if (i < this.params.length - 1) {
                    if (this.params[i].active === true) {
                        for (let j = this.params[i].min; j <= this.params[i].max; j += this.params[i].step) {
                            let arr = [...paramsArr];
                            arr.push(j);
                            this.getRecParams(i + 1, arr);
                        }
                    } else {
                        let arr = [...paramsArr];
                        arr.push(null);
                        this.getRecParams(i + 1, arr);
                    }
                }
            },
            getSimulationParams(value) {
                let p = JSON.parse(JSON.stringify(this.simulationParams));
                p[this.currentParam] = value;
                return p;
            },
            update: function (organisms, params) {
                var x = params.width;
                var y = params.height;

                for (let i = 0; i < organisms.length; i++) {
                    var organism = organisms[i];
                    if (organism instanceof Predator) {
                        organism.movePredator(organisms, x - 1, y - 1)
                    } else if (organism instanceof Prey) {
                        organism.movePrey(organisms, x - 1, y - 1)
                    } else if (organism instanceof Person) {
                        organism.moveHunter(organisms, x - 1, y - 1)
                    }
                }
                return this.getGrid(organisms);
            }
            ,
            getGrid: function (organisms) {
                let countPrey = 0;
                let countPredator = 0;
                let countHuman = 0;

                for (let i = 0; i < organisms.length; i++) {
                    let o = organisms[i];
                    if (o instanceof Predator) {
                        countPredator++;
                    } else if (o instanceof Prey) {
                        countPrey++;
                    } else if (o instanceof Person) {
                        countHuman++;
                    }
                }

                return [countPrey, countPredator, countHuman]
            }
            ,
            randomSeed: function (params, organisms) {
                organisms = [];
                Person.setPreyNeedLimit(params.preyNeedLimit);
                Person.setPreyNeedStepsLimit(params.preyNeedStepsLimit);

                for (let i = 0; i < params.width; i++) {
                    for (let j = 0; j < params.height; j++) {
                        let rnd = Math.random();
                        let isAlive = rnd < params.isAliveProbability;
                        let isPredator = rnd < params.isPredatorProbability;
                        let isHuman = rnd < params.isHumanProbability;

                        let organism = null;
                        if (isAlive === true) {
                            if (isHuman === true && params.isHumanRequired) {
                                organism = new Person(
                                    params.predatorLifespan,
                                    i, j,
                                    params.killPredatorPriority,
                                    params.killPreyPriority,
                                    params.killRange,
                                    params.noticeOrganismRange
                                );
                            } else if (isPredator === true) {
                                organism = new Predator(
                                    params.predatorLifespan,
                                    params.predatorAdulthoodAge,
                                    params.predatorBirthPeriod,
                                    params.predatorFeedPreyCount,
                                    i, j);
                            } else {
                                organism = new Prey(
                                    params.preyLifespan,
                                    params.preyAdulthoodAge,
                                    params.preyBirthPeriod,
                                    i, j);
                            }
                            organisms.push(organism)
                        }
                    }
                }
                return organisms;
            },
            savePdf() {
                saveSimulationExperimentPdf("app-experiment", "gameHumanExp",
                    this.simulationParams, this.currentParam);
            },
            saveXlsx() {
                var wb = createWorkbook();
                for (let i = 0; i < this.seriesArray.length; i++) {
                    for (let j = 0; j < this.seriesArray[i].length; j++) {
                        var series = this.seriesArray[i][j];
                        var data = Array.from(series.data);
                        data.splice(0, 0, [series.name, "time"]);
                        wb = createWorkSheet(wb, data, series.name + "_" + i + "");
                    }
                }
                saveWorkbook("predatorPreySimulationExperiment", wb);
            }
        }
    }

    function runSimulationExperiment(parameters, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                parameters[this.params[i].name] = arr[i];
            }
        }
        let rndSeed = this.randomSeed;
        let upd = this.update;
        let tick = this.maxTick;
        let isAlive = this.experimentRun;
        let that = this;
        let p = new Promise(function (resolve, reject) {
            setTimeout(() => {
                let p = parameters;
                let dataPrey = [];
                let dataPredator = [];
                let organisms = [];
                organisms = rndSeed(p, organisms);
                for (let j = 0; j < tick && isAlive; j++) {
                    let update = upd(organisms, p);
                    dataPrey.push([j, update[0]]);
                    dataPredator.push([j, update[1]]);
                }
                let series = [
                    {name: "Prey population", data: dataPrey},
                    {
                        name: "Predator population",
                        data: dataPredator
                    }
                ];
                series.push({
                    name: "Prey min",
                    type: "area",
                    data: [[0, that.preyMinCount], [that.maxTick, that.preyMinCount]]
                });
                series.push({
                    name: "Prey max",
                    type: "area",
                    data: [[0, that.preyMaxCount], [that.maxTick, that.preyMaxCount]]
                });
                resolve(series);
            }, 500);
        });
        p.then((series) => {
            if (this.experimentRun === true) {
                this.experimentHuman.push([...series]);
                let t = this.getOverallTimeBetween(
                    series[0].data,
                    this.preyMinCount,
                    this.preyMaxCount
                );
                let t1 = this.getMaxTimeBetween(
                    series[0].data,
                    this.preyMinCount,
                    this.preyMaxCount
                );
                if (t >= this.maxTimeThreshold
                    && t1 >= this.maxTimeThreshold) {
                    this.maxTimeOverall.push(t);
                    this.items.push({
                        index: this.experimentCount.toFixed(2),
                        killPredatorPriority: parameters[this.params[0].name].toFixed(2),
                        killPreyPriority: parameters[this.params[1].name].toFixed(2),
                        killRange: parameters[this.params[2].name].toFixed(2),
                        noticeOrganismRange: parameters[this.params[3].name].toFixed(2),
                        preyNeedLimit: parameters[this.params[4].name].toFixed(2),
                        preyNeedStepsLimit: parameters[this.params[5].name].toFixed(2),
                        maxOverallTime: t,
                        longestMax: t1
                    })
                }
                this.experimentCount++;
                if (this.experimentCount >= this.experimentMaxCount) {
                    this.isExperimentFinished = true;
                }
            }
        })
    }
</script>

<style scoped>
    .spinner-grow {
        color: aqua;
        width: 60px;
        height: 60px;
        margin: 20px auto;
    }

    .vs-select-item {
        color: black;
    }

    .vs-select {
        color: black;
    }

    .vs-input {
        color: black;
    }

    .button {
        margin-right: 10px;
    }

</style>