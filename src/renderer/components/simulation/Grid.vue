<template>
    <div>
        <b-col>
            <app-stats :cells="simulationParams.width * simulationParams.height"
                       :predator="dataPredator[currentTick][1]"
                       :prey="dataPrey[currentTick][1]"
                       :speed="currentSpeed"
                       :tick="currentTick"
                       v-if="dataPrey.length > 0"/>
            <transition mode="out-in">
                <div class="grid columns">
                    <div :key="indexX"
                         class="column"
                         v-for="(col, indexX) in organismsGrid"
                         v-if="organismsGrid.length > 0">
                        <app-cell :is-mouse-down="isMouseDown"
                                  :key="indexY"
                                  :organism="o"
                                  @wasUpdated="updateCellCount"
                                  v-for="(o, indexY) in col"/>
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
    import {simulationParams} from '../../assets/simulation/simulationParams'

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
        },
        data() {
            return {
                simulationParams: simulationParams,
                organisms: [],
                organismsGrid: [],

                currentTick: 0,
                isMouseDown: true,

                series: [],
                seriesBehave: [],
                dataBehave: [],
                dataPrey: [],
                dataPredator: [],
            };
        },
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
                this.organismsGrid = [];
                this.resetGrid();
            },
            update: function () {
                let maxWidth = this.simulationParams.width - 1;
                let maxHeight = this.simulationParams.height - 1;
                // let organisms = [...this.organismsGrid];
                for (let i = 0; i < this.organismsGrid.length; i++) {
                    for (let j = 0; j < this.organismsGrid[i].length; j++) {
                        let organism = this.organismsGrid[i][j];
                        // let organism = organisms[i][j];
                        if (organism) {
                            if (organism instanceof Predator) {
                                organism.movePredator(this.organismsGrid, maxWidth, maxHeight)
                            } else if (organism instanceof Prey) {
                                organism.movePrey(this.organismsGrid, maxWidth, maxHeight)
                            } else if (organism instanceof Person) {
                                organism.moveHunter(this.organismsGrid, maxWidth, maxHeight)
                            }
                        }
                    }
                }
            },
            resetGrid() {
                this.organismsGrid = [];
                for (let i = 0; i < this.simulationParams.width; i++) {
                    this.organismsGrid[i] = [];
                    for (let j = 0; j < this.simulationParams.height; j++) {
                        this.organismsGrid[i][j] = null;
                    }
                }
            },
            getGrid: function () {
                // this.resetGrid();
                let countPrey = 0;
                let countPredator = 0;
                let countHuman = 0;
                for (let i = 0; i < this.organismsGrid.length; i++) {
                    for (let j = 0; j < this.organismsGrid[i].length; j++) {
                        let o = this.organismsGrid[i][j];
                        if (o && o.x >= 0 && o.y >= 0) {
                            if (o instanceof Predator) {
                                countPredator++;
                            } else if (o instanceof Prey) {
                                countPrey++;
                            } else if (o instanceof Person) {
                                countHuman++;
                            }
                        }
                    }
                }

                if (this.currentTick === 0 && countPrey === 0 && countPredator === 0) {
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
                this.resetGrid();
                this.$emit('series', {series: this.series, seriesBehave: this.seriesBehave});
            },
            randomSeed: function () {
                Person.setPreyNeedLimit(this.simulationParams.preyNeedLimit);
                Person.setPreyNeedStepsLimit(this.simulationParams.preyNeedStepsLimit);
                Predator.hungerSteps = this.simulationParams.hungerSteps;
                this.organisms = [];
                for (let i = 0; i < this.simulationParams.width; i++) {
                    this.organismsGrid[i] = [];
                    for (let j = 0; j < this.simulationParams.height; j++) {
                        let rnd = Math.random();
                        let isAlive = rnd < this.simulationParams.isAliveProbability;
                        let isPredator = rnd < this.simulationParams.isPredatorProbability;
                        let isHuman = rnd < this.simulationParams.isHumanProbability;

                        if (isAlive === true) {
                            if (isHuman === true && this.simulationParams.isHumanRequired) {
                                this.organismsGrid[i][j] = new Person(
                                    this.simulationParams.predatorLifespan,
                                    i, j,
                                    this.simulationParams.killPredatorPriority,
                                    this.simulationParams.killPreyPriority,
                                    this.simulationParams.killRange,
                                    this.simulationParams.noticeOrganismRange
                                );
                            } else if (isPredator === true) {
                                this.organismsGrid[i][j] = new Predator(
                                    this.simulationParams.predatorLifespan,
                                    this.simulationParams.predatorAdulthoodAge,
                                    this.simulationParams.predatorBirthPeriod,
                                    this.simulationParams.predatorFeedPreyCount,
                                    i, j);
                            } else {
                                this.organismsGrid[i][j] = new Prey(
                                    this.simulationParams.preyLifespan,
                                    this.simulationParams.preyAdulthoodAge,
                                    this.simulationParams.preyBirthPeriod,
                                    i, j);
                            }
                        } else {
                            this.organismsGrid[i][j] = null;
                        }
                    }
                }
            },
            updateCellCount: function (bool) {},
            saveData() {
                var wb = createWorkbook();
                // add data prey
                var data = Array.from(this.dataPrey);
                data.splice(0, 0, ["time", "prey amount"]);
                wb = createWorkSheet(wb, data, "prey");
                // add dataI
                data = Array.from(this.dataPredator);
                data.splice(0, 0, ["time", "predator amount"]);
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
