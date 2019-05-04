<template>
    <div>
        <b-col>
            <app-stats
                    :cell-count="cellCount"
                    :cells-alive="cellsAlive"
                    :cells-created="cellsCreated"
                    :current-speed="currentSpeed"
                    :current-tick="currentTick"/>
            <div
                    @mousedown="isMouseDown = true"
                    @mouseleave="isMouseDown = false"
                    @mouseup="isMouseDown = false"
                    class="grid columns">
                <div
                        :key="indexX"
                        class="column"
                        v-for="(col, indexX) in gridListOrg"
                        v-if="gridListOrg.length > 0">
                    <app-cell
                            :is-mouse-down="isMouseDown"
                            :organism="o"
                            @wasUpdated="updateCellCount"
                            :key="indexY"
                            v-for="(o, indexY) in col"
                    />
                </div>
            </div>
        </b-col>
    </div>
</template>

<script>
    import Cell from './Cell.vue';
    import Stats from './Stats.vue';
    import {Predator} from "../../assets/simulation/Predator";
    import {Prey} from "../../assets/simulation/Prey";
    import {Person} from "../../assets/simulation/Person";

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
            importToken: {
                default: '',
                type: String,
            },
            currentSpeed: {
                default: 0,
                type: Number,
            },
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

                    width: 40,
                    height: 20,
                },
                gridList: [],
                organisms: [],
                gridListOrg: [],

                // Stats that get passed down to the app-stats component
                currentTick: 0,
                cellCount: 0,
                cellsAlive: 0,
                cellsCreated: 0,

                // A prop that gets used by the app-cell component (drag)
                isMouseDown: false,

                isHumanRequired: false,

                ////////////////////////////////////////////
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
                    if (o instanceof Predator) {
                        countPredator++;
                    } else if (o instanceof Prey) {
                        countPrey++;
                    } else if (o instanceof Person) {
                        countHuman++;
                    }
                    if (o.x >= 0 && o.y >= 0) {
                        this.gridListOrg[o.x][o.y] = o;
                    }
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
                this.dataHuman = [];
                this.dataBehave = [];
                this.$emit('series', {series: this.series, seriesBehave: this.seriesBehave});
            },
            randomSeed: function () {
                this.organisms = [];
                this.reset();
                for (let i = 0; i < this.simulationParams.width; i++) {
                    for (let j = 0; j < this.simulationParams.height; j++) {
                        let rnd = Math.random();
                        let isAlive = rnd < this.simulationParams.isAliveProbability;
                        let isPredator = rnd < this.simulationParams.isPredatorProbability;
                        let isHuman = rnd < 0.02;

                        let organism = null;
                        if (isAlive === true) {
                            if (isHuman === true && this.isHumanRequired) {
                                organism = new Person(
                                    this.simulationParams.predatorLifespan,
                                    i, j,
                                    0.1,
                                    0.3,
                                    1,
                                    5);
                            } else if (isPredator === true) {
                                organism = new Predator(
                                    this.simulationParams.predatorLifespan,
                                    this.simulationParams.predatorAdulthoodAge,
                                    this.simulationParams.predatorBirthPeriod,
                                    this.simulationParams.predatorFeedPreyCount,
                                    i, j)
                            } else {
                                organism = new Prey(
                                    this.simulationParams.preyLifespan,
                                    this.simulationParams.preyAdulthoodAge,
                                    this.simulationParams.preyBirthPeriod,
                                    i, j)
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
