<template>
    <div>
        <b-row>
            <b-col sm="4">
                <app-controller
                        :is-running="isRunning"
                        @send="delegate($event)"
                        @params="onParams"
                        @type="onModelType"
                        style="height: 500px; margin-left: 40px"
                ></app-controller>
            </b-col>
            <b-col sm="8">
                <transition mode="out-in" name="fade">
                    <app-grid
                            style="margin-right: 40px"
                            :current-speed="speed"
                            :import-token="importToken"
                            :message="message"
                            :params="params"
                            @series="onSeries"/>
                </transition>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div style="width: 500px;">
                    <basic-chart-box :chart-options="chartOptions" :series="series"/>
                </div>
            </b-col>
            <b-col>
                <behaviour-diargam :series="seriesBehave"></behaviour-diargam>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Controller from './simulation/Controller.vue';
    import Grid from './simulation/Grid.vue';
    import {clearInterval, setInterval} from 'timers';
    import BasicChartBox from "./diagrams/BasicChartBox"
    import BehaviourDiargam from './diagrams/BehaviourDiargam'

    export default {
        name: 'PredatorPreyApp',
        components: {
            'app-grid': Grid,
            'app-controller': Controller,
            BasicChartBox,
            BehaviourDiargam
        },
        data() {
            return {
                message: '',
                modelType: '',
                importToken: '',
                exportToken: '',
                params: null,

                isRunning: false,
                isNavbar: false,
                isImport: false,
                isExport: false,

                speed: 100,
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
                    this.speed > 100 ? this.changeSpeed(-100) : this.changeSpeed(-20);
                    this.restartInterval();
                } else if (event === 'speedUp') {
                    this.speed < 100 ? this.changeSpeed(20) : this.changeSpeed(100);
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
                if (this.speed < 20) {
                    this.speed = 20;
                } else if (this.speed > 500) {
                    this.speed = 500;
                }
            },
        },
    };
</script>

<style lang="scss">
    html,
    body {
        color: #000;
        font-family: "Dosis", Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0px;
    }

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #fff;
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

    // The transitions used to switch out my page components as well as
    // the import/export modal
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.35s linear;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>
