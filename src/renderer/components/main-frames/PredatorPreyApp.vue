<template>
    <div>
        <b-row>
            <b-col sm="4">
                <app-controller
                        :is-running="isRunning"
                        @params="onParams"
                        @send="delegate($event)"
                        @type="onModelType"
                        style="height: 500px; margin-left: 40px"
                ></app-controller>
            </b-col>
            <b-col sm="8">
                <transition mode="out-in" name="fade">
                    <app-grid
                            :currentspeed="speed"
                            :message="message"
                            :current-speed="speed"
                            @series="onSeries"
                            style="margin-right: 40px"/>
                </transition>
                <vs-divider/>
                <b-tabs style="margin-top: 20px; width: 1000px;">
                    <b-tab active title="Size change">
                        <basic-chart-box :chart-options="chartOptions" :series="series"
                                         id="simulationSeries"/>
                    </b-tab>
                    <b-tab title="Behaviour">
                        <behaviour-diargam :series="seriesBehave"
                                           id="simulationBehave"></behaviour-diargam>
                    </b-tab>
                </b-tabs>
            </b-col>
        </b-row>
        <vs-divider/>
        <simulation-experiment :simulation-params="params"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Controller from '../simulation/Controller.vue';
    import Grid from '../simulation/Grid.vue';
    import {clearInterval, setInterval} from 'timers';
    import BasicChartBox from "../diagrams/BasicChartBox"
    import BehaviourDiargam from '../diagrams/BehaviourDiargam'
    import SimulationExperiment from '../simulation/SimulationExperiment'
    import {simulationParams as params} from "../../assets/simulation/simulationParams";

    export default {
        name: 'PredatorPreyApp',
        components: {
            'app-grid': Grid,
            'app-controller': Controller,
            BasicChartBox,
            BehaviourDiargam,
            SimulationExperiment
        },
        data() {
            return {
                message: '',
                modelType: '',
                importToken: '',
                exportToken: '',
                params: params,

                isRunning: false,
                isNavbar: false,
                isImport: false,
                isExport: false,

                speed: 400,
                intervalID: 0,

                mainComponent: 'gamePage',
                selectedScenario: 'scenario',

                chartOptions: {
                    title: {
                        text: 'Predator-prey population size'
                    },
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
                series: [],
                seriesBehave: []
            };
        },
        methods: {
            onParams(data) {
                this.params = data;
            },
            onModelType(data) {
                this.modelType = data;
            },
            onSeries(data) {
                this.series = data.series;
                this.seriesBehave = data.seriesBehave;
            },
            delegate: function (event) {
                if (event === 'play') {
                    this.isRunning = !this.isRunning;
                    this.restartInterval();
                } else if (event === 'slowDown') {
                    this.changeSpeed(-50);
                    this.restartInterval();
                } else if (event === 'speedUp') {
                    this.changeSpeed(50);
                    this.restartInterval();
                } else {
                    this.updateMessage(event);
                }
            },
            updateMessage: function (newMessage) {
                this.message = newMessage;
                Vue.nextTick(this.resetMessage);
            },
            resetMessage: function () {
                this.series = [];
                this.message = '';
            },
            restartInterval: function () {
                clearInterval(this.intervalID);
                if (this.isRunning) {
                    this.intervalID = setInterval(
                        this.updateMessage,
                        50000 / this.speed,
                        'nextStep'
                    );
                }
            },
            changeSpeed: function (speed) {
                this.speed += speed;
            },
        },
    };
</script>

<style lang="scss">
    html,
    body {
        color: #000;
        font-family: 'Karla', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0px;
    }

    #app {
        font-family: 'Karla', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .hero-body {
        align-items: stretch !important;
        padding-top: 18px;
        padding-bottom: 12px;
    }

    .footer {
        padding: 1rem;
        background-color: transparent;
    }

    .navbar-item {
        color: #ff9766;
    }

    .hr {
        position: relative;
        border-top: 2px solid #414b5c;
        margin: 0px;
        bottom: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.35s linear;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>
