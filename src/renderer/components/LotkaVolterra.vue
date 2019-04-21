<template>
    <div>
        <h2>Lotka-Volterra model</h2>
        <b-row>
            <b-col sm="3">
                <div>
                    <b-row>
                        <b-col sm="4">
                            <label>Prey</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input placeholder="Prey" type="number" v-model.number="prey"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Predator</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input placeholder="Predator" type="number" v-model.number="predator"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Alpha</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Alpha" step="0.01"
                                          type="number"
                                          v-model.number="alpha"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Gamma 1</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Gamma 1" step="0.01"
                                          type="number"
                                          v-model.number="gamma1"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Beta</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Beta" step="0.01" type="number"
                                          v-model.number="beta"></b-form-input>
                        </b-col>

                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Gamma 2</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Gamma 2" step="0.01"
                                          type="number"
                                          v-model.number="gamma2"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Time</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01" type="number"
                                          v-model.number="time"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Time step</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                          step="0.00000001"
                                          type="number"
                                          v-model.number="timeStep"></b-form-input>
                        </b-col>
                    </b-row>
                    <div style="margin-top: 10px">
                        <b-button v-on:click="calculateLotkaVolterra" variant="outline-primary">
                            Calculate
                        </b-button>
                        <b-button v-on:click="saveData" variant="outline-primary">
                            Save
                        </b-button>
                    </div>
                </div>
            </b-col>
            <b-col sm="9">
                <div>
                    <apexchart :options="chartOptions" :series="series" type="area" width="700"></apexchart>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import {lotkaVolterra} from "../assets/lotkaVolterra";
    import {calculatePath} from "../assets/gpaphUtils";
    import VueApexCharts from 'vue-apexcharts'
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../assets/xlsx_utils";

    export default {
        name: "LotkaVolterra",
        components: {
            apexchart: VueApexCharts
        },
        data() {
            return {
                prey: 1.8,
                predator: 1.8,
                alpha: 0.6666,
                gamma1: 1.3333,
                beta: 1,
                gamma2: 1,
                time: 30,
                timeStep: 0.1,
                dataPrey: [],
                dataPredator: [],
                timeArray: [],
                line: '',
                linePrey: '',
                linePredator: '',
                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: this.timeArray
                    },
                    stroke: {
                        curve: "smooth"
                    },
                },
                series: []
            }
        },
        methods: {
            calculateLotkaVolterra() {
                const result = lotkaVolterra(this.prey, this.predator, this.alpha, this.beta, this.gamma1, this.gamma2);
                this.calculateForTime(this.time);
                this.linePrey = calculatePath(this.dataPrey);
                this.linePredator = calculatePath(this.dataPredator);
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
                this.chartOptions.xaxis = this.timeArray
            },
            calculateForTime(t) {
                this.dataPrey = [];
                this.dataPredator = [];
                this.timeArray = [];
                let x = this.prey;
                let y = this.predator;
                this.dataPrey.push([0, x]);
                this.dataPredator.push([0, y]);
                this.timeArray.push(0);
                for (let i = 1; i < t; i += this.timeStep) {
                    let res = lotkaVolterra(x, y, this.alpha, this.beta, this.gamma1, this.gamma2);
                    x = x + this.timeStep * res.prey;
                    y = y + this.timeStep * res.predator;
                    this.dataPrey.push([i, x]);
                    this.dataPredator.push([i, y])
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
                saveWorkbook("test", wb);
            }
        }
    }
</script>

<style lang="sass" scoped>
    svg
        margin: 25px

        path
            fill: none
            stroke: #76BF8A
            stroke-width: 1px

        .path-predator
            stroke: lightcoral

        .path-prey
            stroke: gold

        .chart
        width: 100%
</style>