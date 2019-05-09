<template>
    <div>
        <b-col v-if="showGreed">
            <app-stats
                    :cell-count="cellCount"
                    :cells-alive="cellsAlive"
                    :cells-created="cellsCreated"
                    :current-speed="currentSpeed"
                    :current-tick="currentTick"/>
            <transition mode="out-in">
                <div class="grid columns">
                    <div
                            :key="indexX"
                            class="column"
                            v-for="(col, indexX) in gridListOrg"
                            v-if="gridListOrg.length > 0">
                        <app-cell
                                :is-mouse-down="isMouseDown"
                                :key="indexY"
                                :organism="o"
                                @wasUpdated="updateCellCount"
                                v-for="(o, indexY) in col"
                        />
                    </div>
                </div>
            </transition>
        </b-col>
    </div>
</template>

<script>
    import Cell from './Cell.vue';
    import Stats from './Stats.vue';
    import {Predator} from "../../assets/simulation/Predator";
    import {Prey} from "../../assets/simulation/Prey";
    import {Person} from "../../assets/simulation/Person";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";

    export default {
        components: {
            'app-cell': Cell,
            'app-stats': Stats,
        },
        props: {
            message: {
                default: '',
                type: String,
            },
            params: {
                type: Object
            },
            currentSpeed: {
                default: 0,
                type: Number,
            },
            showGreed: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                simulationParams: {
                    preyLifespan: 60,
                    preyAdulthoodAge: 2,
                    preyBirthPeriod: 2,

                    predatorLifespan: 100,
                    predatorAdulthoodAge: 5,
                    predatorBirthPeriod: 1,
                    predatorFeedPreyCount: 2,

                    hungerSteps: 8,

                    isAliveProbability: 0.4,
                    isPredatorProbability: 0.2,
                    isHumanProbability: 0.01,
                    isHumanRequired: true,
                    killPredatorPriority: 0.2,
                    killPreyPriority: 0.1,
                    killRange: 12,
                    noticeOrganismRange: 20,
                    preyNeedLimit: 10,
                    preyNeedStepsLimit: 12,

                    width: 40,
                    height: 20,
                },
                gridList: [],
                organisms: [],
                gridListOrg: [],

                currentTick: 0,
                cellCount: 0,
                cellsAlive: 0,
                cellsCreated: 0,

                isMouseDown: true,

                series: [],
                seriesBehave: [],
                dataBehave: [],
                dataPrey: [],
                dataPredator: [],
            };
        },
        computed: {},
        watch: {
            message: function (val) {
                if (val === 'saveData') {
                    this.saveData();
                    return;
                }
                if (val === 'nextStep') {
                    this.update();
                    this.currentTick++;
                } else if (val === 'redoSession') {
                    this.reset();
                } else if (val === 'randomSeed') {
                    this.randomSeed();
                }
                this.getGrid();
            },
            params: function (data) {
                this.simulationParams = data;
            }
        },
        created() {
            this.startGrid();
        },
        methods: {
            startGrid: function () {
                this.dataPredator = [];
                this.dataPrey = [];
                this.dataBehave = [];
                this.gridListOrg = [];

                for (let i = 0; i < this.simulationParams.width; i++) {
                    this.gridListOrg[i] = [];
                    for (let j = 0; j < this.simulationParams.height; j++) {
                        this.gridListOrg[i][j] = null;
                    }
                }
                this.cellCount = this.simulationParams.width * this.simulationParams.height;
            },
            update: function () {
                var x = this.simulationParams.width;
                var y = this.simulationParams.height;

                for (let i = 0; i < this.organisms.length; i++) {
                    var organism = this.organisms[i];
                    if (organism instanceof Predator) {
                        organism.movePredator(this.organisms, x - 1, y - 1)
                    } else if (organism instanceof Prey) {
                        organism.movePrey(this.organisms, x - 1, y - 1)
                    } else if (organism instanceof Person) {
                        organism.moveHunter(this.organisms, x - 1, y - 1)
                    }
                }
            },
            getGrid: function () {
                for (let i = 0; i < this.simulationParams.width; i++) {
                    this.gridListOrg[i] = [];
                    for (let j = 0; j < this.simulationParams.height; j++) {
                        this.gridListOrg[i][j] = null;
                    }
                }

                let countPrey = 0;
                let countPredator = 0;
                let countHuman = 0;

                for (let i = 0; i < this.organisms.length; i++) {
                    let o = this.organisms[i];
                    if (o.x >= 0 && o.y >= 0) {
                        if (o instanceof Predator) {
                            countPredator++;
                        } else if (o instanceof Prey) {
                            countPrey++;
                        } else if (o instanceof Person) {
                            countHuman++;
                        }
                        this.gridListOrg[o.x][o.y] = o;
                    } else {
                        console.log("OUT")
                    }
                }

                if (this.currentTick === 0 && countPrey == 0 && countPredator === 0) {
                    return;
                }
                this.dataPrey.push([this.currentTick, countPrey]);
                this.dataPredator.push([this.currentTick, countPredator]);
                this.dataBehave.push([countPrey, countPredator]);

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
                this.seriesBehave = [
                    {
                        name: "Behaviour",
                        data: this.dataBehave
                    },
                ];
                this.$emit('series', {series: this.series, seriesBehave: this.seriesBehave});
            },
            reset: function () {
                this.currentTick = 0;
                this.cellsAlive = 0;
                this.cellsCreated = 0;
                this.series = [];
                this.seriesBehave = [];
                this.dataPrey = [];
                this.dataPredator = [];
                this.dataBehave = [];
                this.organisms = [];
                this.getGrid();
                if (this.showGreed) {
                    this.$emit('series', {series: this.series, seriesBehave: this.seriesBehave});
                }
            },
            randomSeed: function () {
                this.organisms = [];
                Person.setPreyNeedLimit(this.simulationParams.preyNeedLimit);
                Person.setPreyNeedStepsLimit(this.simulationParams.preyNeedStepsLimit);

                this.reset();
                for (let i = 0; i < this.simulationParams.width; i++) {
                    for (let j = 0; j < this.simulationParams.height; j++) {
                        let rnd = Math.random();
                        let isAlive = rnd < this.simulationParams.isAliveProbability;
                        let isPredator = rnd < this.simulationParams.isPredatorProbability;
                        let isHuman = rnd < this.simulationParams.isHumanProbability;

                        let organism = null;
                        if (isAlive === true) {
                            if (isHuman === true && this.simulationParams.isHumanRequired) {
                                organism = new Person(
                                    this.simulationParams.predatorLifespan,
                                    i, j,
                                    this.simulationParams.killPredatorPriority,
                                    this.simulationParams.killPreyPriority,
                                    this.simulationParams.killRange,
                                    this.simulationParams.noticeOrganismRange
                                );
                            } else if (isPredator === true) {
                                organism = new Predator(
                                    this.simulationParams.predatorLifespan,
                                    this.simulationParams.predatorAdulthoodAge,
                                    this.simulationParams.predatorBirthPeriod,
                                    this.simulationParams.predatorFeedPreyCount,
                                    i, j);
                            } else {
                                organism = new Prey(
                                    this.simulationParams.preyLifespan,
                                    this.simulationParams.preyAdulthoodAge,
                                    this.simulationParams.preyBirthPeriod,
                                    i, j);
                            }
                            this.organisms.push(organism)
                        }
                        this.gridListOrg[i][j] = organism;
                    }
                }
                Predator.hungerSteps = this.simulationParams.hungerSteps;
            },
            updateCellCount: function (bool) {
                if (bool) {
                    this.cellsAlive++;
                    this.cellsCreated++;
                } else {
                    this.cellsAlive--;
                }
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
                saveWorkbook("predatorPreySimulation", wb);
            },
        },
    };
</script>

<style lang="scss">
    .grid {
        border-top: 1px solid #1a0707;
        border-left: 1px solid #1a0707;
        display: flex;
        flex: 1;
        justify-content: center;
    }

    .column {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 0;
        margin: 0 auto;
        flex-direction: column;
    }
</style>
