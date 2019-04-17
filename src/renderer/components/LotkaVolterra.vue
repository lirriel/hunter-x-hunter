<template>
    <div>
        <b-row>
            <b-col sm="3">
                <div>
                    <b-row>
                        <b-col sm="4">
                            <label>Prey</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="prey" placeholder="Prey" type="number"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Predator</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="predator" placeholder="Predator" type="number"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Alpha</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="alpha" placeholder="Alpha" type="number" step="0.01"
                                          min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Gamma 1</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="gamma1" placeholder="Gamma 1" type="number" step="0.01"
                                          min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Beta</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="beta" placeholder="Beta" type="number" step="0.01" min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>

                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Gamma 2</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="gamma2" placeholder="Gamma 2" type="number" step="0.01"
                                          min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Time</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="time" placeholder="Time" type="number" step="0.01" min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Time step</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="timeStep" placeholder="Time step" type="number"
                                          step="0.00000001"
                                          min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-button variant="outline-primary" v-on:click="calculateLotkaVolterra">
                        Calculate
                    </b-button>
                </div>
            </b-col>
            <b-col sm="9">
                <div>
                    <apexchart width="700" type="area" :options="chartOptions" :series="series"></apexchart>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import {lotkaVolterra} from "../assets/lotkaVolterra";
    import * as d3 from 'd3';
    import VueApexCharts from 'vue-apexcharts'

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
                const result = lotkaVolterra(this.prey, this.predator, this.alpha, this.beta, this.gamma1, this.gamma2)
                this.calculateForTime(this.time)
                this.linePrey = this.calculatePath(this.dataPrey)
                this.linePredator = this.calculatePath(this.dataPredator)
                this.series = [
                    {
                        name: "Prey population",
                        data: this.dataPrey
                    },
                    {
                        name: "Predator population",
                        data: this.dataPredator
                    }
                ]
                this.chartOptions.xaxis = this.timeArray
            },
            calculateForTime(t) {
                this.dataPrey = []
                this.dataPredator = []
                this.timeArray = []
                let x = this.prey
                let y = this.predator
                this.dataPrey.push([0, x])
                this.dataPredator.push([0, y])
                this.timeArray.push(0)
                for (let i = 1; i < t; i += this.timeStep) {
                    let res = lotkaVolterra(x, y, this.alpha, this.beta, this.gamma1, this.gamma2)
                    x = x + this.timeStep * res.prey
                    y = y + this.timeStep * res.predator
                    this.dataPrey.push([i, x])
                    this.dataPredator.push([i, y])
                }
            },
            getScales(data) {
                const x = d3.scaleTime().range([0, 600]);
                const y = d3.scaleLinear().range([400, 0]);
                d3.axisLeft().scale(x);
                d3.axisBottom().scale(y);
                x.domain(d3.extent(data, (d, i) => i));
                y.domain([0, d3.max(data, d => d)]);
                return {x, y};
            },
            calculatePath(data) {
                const scale = this.getScales(data);
                const path = d3.line()
                    .x((d, i) => scale.x(i))
                    .y(d => scale.y(d));
                const line = path(data);
                return line
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