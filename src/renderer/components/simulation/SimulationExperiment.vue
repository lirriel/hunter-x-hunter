<template>
    <div style="margin-bottom: 100px">
        <b-button style="width: 100%" v-b-toggle.collapse variant="danger">Comparison experiment
        </b-button>
        <b-collapse id="collapse" invisible>
            <b-card>
                <b-row style="margin-top: 20px;">
                    <b-form-select :options="Object.keys(simulationParams)"
                                   style="margin-bottom: 20px"
                                   v-model="currentParam"/>
                    <b-col>
                        <label>Start value</label>
                        <b-form-input max="1000.00" min="0.00" placeholder="Start value"
                                      step="0.0001"
                                      type="number"
                                      v-model.number="min"/>
                    </b-col>
                    <b-col>
                        <label>Max value</label>
                        <b-form-input max="1000.00" min="0.00" placeholder="Max value"
                                      step="0.0001"
                                      type="number"
                                      v-model.number="max"/>
                    </b-col>
                    <b-col>
                        <label>Step</label>
                        <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                      step="0.000001"
                                      type="number"
                                      v-model.number="step"/>
                    </b-col>

                    <b-col>
                        <label>Prey min count</label>
                        <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                      step="0.000001"
                                      type="number"
                                      v-model.number="preyMinCount"/>
                    </b-col>

                    <b-col>
                        <label>Prey max count</label>
                        <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                      step="0.000001"
                                      type="number"
                                      v-model.number="preyMaxCount"/>
                    </b-col>

                    <b-col>
                        <label>Timer</label>
                        <b-form-input max="1000.00" min="0.0000" placeholder="15 ticks"
                                      step="0.000001"
                                      type="number"
                                      v-model.number="maxTick"/>
                    </b-col>
                    <b-col>
                        <b-button v-on:click="start" variant="outline-primary">Start</b-button>
                        <b-button v-on:click="savePdf" variant="outline-primary">Save pdf</b-button>
                        <b-button v-on:click="saveXlsx" variant="outline-primary">Save data
                        </b-button>
                    </b-col>
                </b-row>
                <b-row v-if="showSpinner">
                    <b-spinner label="Spinning" type="grow"></b-spinner>
                </b-row>
                <b-row id="gameHumanExp" v-if="!showSpinner">
                    <b-col v-for="(value, ind) in valueArray">
                        <label>{{currentParam}} = {{value}}</label>
                        <label>Longest period = {{maxTimeBetweenValues[ind][0]}}</label>
                        <br>
                        <label>Overall period = {{maxTimeBetweenValues[ind][1]}}</label>
                        <basic-chart-box :chart-options="chartOptions" :series="seriesArray[ind]"
                                         style="width: 700px"/>
                    </b-col>
                </b-row>
                <b-col>
                    <b-row>
                        <b-button v-on:click="getHumanInteractionEvaluation">Start exp</b-button>
                    </b-row>
                    <b-row>
                        <label>Is finished: {{isExperimentFinished}}</label>
                    </b-row>
                    <b-progress :max="experimentMaxCount" height="20px" width="500px">
                        <b-progress-bar :value="experimentCount">
                            Progress: <strong>{{ experimentCount.toFixed(2) }} / {{
                            experimentMaxCount}}</strong>
                        </b-progress-bar>
                    </b-progress>
                    <b-row>
                        <b-col v-for="p in params">
                            <label>{{p.name}} min</label>
                            <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                          step="0.000001"
                                          type="number"
                                          v-model.number="p.min"/>
                            <label>{{p.name}} max</label>
                            <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                          step="0.000001"
                                          type="number"
                                          v-model.number="p.max"/>
                            <label>{{p.name}} step</label>
                            <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                          step="0.000001"
                                          type="number"
                                          v-model.number="p.step"/>
                        </b-col>

                    </b-row>
                </b-col>
                <b-col>
                    <label>Minimum threshold</label>
                    <b-form-input max="1000.00" min="0.0000" placeholder="step"
                                  step="0.000001"
                                  type="number"
                                  v-model.number="maxTimeThreshold"/>
                </b-col>
                <div style="color:#000;">
                    <b-table :fields="fields" :items="items" hover/>
                </div>
                <div>
                    <b-form-input type="number" v-model.number="getChartInd"/>
                    <!--<b-button v-on:click="getSeriesHuman(getChartInd)">Get chart</b-button>-->
                    <!--<basic-chart-box :series="getSeriesHuman(getChartInd)"-->
                    <!--:chart-options="chartOptions"/>-->
                </div>
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

    export default {
        name: "SimulationExperiment",
        components: {
            'app-grid': Grid,
            BasicChartBox
        },
        props: {
            simulationParams: {
                type: Object,
                default: {key: 'key'}
            }
        },
        watch: {
            simulationParams: function (data) {
                this.showSpinner = true;
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
                gridList: [],
                organisms: [],
                gridListOrg: [],

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
                chartOptions: {
                    title: {
                        text: 'Predator-prey population size'
                    },
                    colors: ['#6aff6b', '#10e3dd', '#fff6f0', '#f91b26'],
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
                    yaxis: [
                        {
                            axisTicks: {
                                show: true
                            },
                            axisBorder: {
                                show: true,
                                color: "#FF1654"
                            },
                            labels: {
                                style: {
                                    color: "#FF1654"
                                },
                                show: true,
                                rotate: -45,
                                rotateAlways: false,
                                hideOverlappingLabels: true,
                                showDuplicates: false,
                                trim: true,
                                formatter: function (value) {
                                    return value.toFixed(2)
                                }
                            },
                            title: {
                                text: "Prey population"
                            }
                        },
                        {
                            opposite: true,
                            axisTicks: {
                                show: true
                            },
                            axisBorder: {
                                show: true,
                                color: "#247BA0"
                            },
                            labels: {
                                style: {
                                    color: "#247BA0"
                                },
                                show: true,
                                rotate: -45,
                                rotateAlways: false,
                                hideOverlappingLabels: true,
                                showDuplicates: false,
                                trim: true,
                                formatter: function (value) {
                                    return value.toFixed(2);
                                }
                            },
                            title: {
                                text: "Predator population"
                            }
                        },
                        {
                            show: false,
                            seriesName: "Prey population"
                        },
                        {
                            show: false,
                            seriesName: "Prey population"
                        }
                    ],
                    legend: {
                        horizontalAlign: "left",
                        offsetX: 10
                    },
                    stroke: {
                        curve: "smooth",
                        width: 3
                    },
                },
                params: [
                    {name: "killPredatorPriority", min: 0.1, max: 1, step: 0.1},
                    {name: "killPreyPriority", min: 0.1, max: 1, step: 0.1},
                    {
                        name: "killRange",
                        min: 1,
                        max: 7,
                        // max: Math.max(this.simulationParams.width, this.simulationParams.height),
                        step: 1
                        // step: Math.max(this.simulationParams.width, this.simulationParams.height) / 10

                    },
                    {
                        name: "noticeOrganismRange",
                        min: 5,
                        max: 6,
                        // max: Math.max(this.simulationParams.width, this.simulationParams.height),
                        step: 1
                        // step: Math.max(this.simulationParams.width, this.simulationParams.height) / 10
                    },
                    {name: "preyNeedLimit", min: 4, max: 5, step: 1},
                    {name: "preyNeedStepsLimit", min: 4, max: 5, step: 1}
                ],
                maxTimeBetweenValues: [],
                experimentHuman: [],
                experimentMaxCount: 0,
                experimentCount: 0,
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
        methods: {
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
                        let t =
                            this.getMaxTimeBetween(result[0].data, this.preyMinCount, this.preyMaxCount);
                        let t1 = this.getOverallTimeBetween(result[0].data, this.preyMinCount, this.preyMaxCount);
                        this.maxTimeBetweenValues.push([t, t1]);
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
                return this.experimentHuman[ind];
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
                this.isExperimentFinished = false;
                this.maxTimeOverall = [];
                this.items = [];
                let parameters = this.simulationParams;
                this.experimentCount = 0;
                this.experimentMaxCount = 1;
                for (let q = 0; q < this.params.length; q++) {
                    this.experimentMaxCount *= ((this.params[q].max - this.params[q].min) / this.params[q].step + 1)

                }
                console.log(this.experimentMaxCount);
                for (let j = this.params[0].min; j < this.params[0].max; j += this.params[0].step) {
                    for (let j1 = this.params[1].min; j1 < this.params[1].max; j1 += this.params[1].step) {
                        for (let j2 = this.params[2].min; j2 < this.params[2].max; j2 += this.params[2].step) {
                            for (let j3 = this.params[3].min; j3 < this.params[3].max; j3 += this.params[3].step) {
                                for (let j4 = this.params[4].min; j4 < this.params[4].max; j4 += this.params[4].step) {
                                    for (let j5 = this.params[5].min; j5 < this.params[5].max; j5 += this.params[5].step) {
                                        parameters[this.params[0].name] = j;
                                        parameters[this.params[1].name] = j1;
                                        parameters[this.params[2].name] = j2;
                                        parameters[this.params[3].name] = j3;
                                        parameters[this.params[4].name] = j4;
                                        parameters[this.params[5].name] = j5;
                                        let rndSeed = this.randomSeed;
                                        let upd = this.update;
                                        let tick = this.maxTick;
                                        new Promise(function (resolve, reject) {
                                            setTimeout(() => {
                                                let p = parameters;
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
                                                    {
                                                        name: "Predator population",
                                                        data: dataPredator
                                                    }
                                                ];
                                                resolve(series);
                                            }, 500);
                                        }).then((series) => {
                                            this.experimentHuman.push(series);
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
                                                    index: this.experimentCount,
                                                    killPredatorPriority: j,
                                                    killPreyPriority: j1,
                                                    killRange: j2,
                                                    noticeOrganismRange: j3,
                                                    preyNeedLimit: j4,
                                                    preyNeedStepsLimit: j5,
                                                    maxOverallTime: t,
                                                    longestMax: t1
                                                })
                                            }
                                            console.log(this.experimentCount);
                                            this.experimentCount++;
                                            if (this.experimentCount >= this.experimentMaxCount) {
                                                this.isExperimentFinished = true;
                                            }
                                        })
                                    }
                                }
                            }
                        }
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
            },
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
            },
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
</script>

<style scoped>
    .spinner-grow {
        color: aqua;
        width: 60px;
        height: 60px;
        margin: 20px auto;
    }
</style>