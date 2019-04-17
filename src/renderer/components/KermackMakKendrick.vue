<template>
    <div>
        <b-row>
            <b-col sm="3">
                <div>
                    <b-row>
                        <b-col sm="4">
                            <label>S</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="S" placeholder="S" type="number"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>I</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="I" placeholder="I" type="number"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>R</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="R" placeholder="R" type="number" step="0.01"
                                          min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>b</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="b" placeholder="b" type="number" step="0.01"
                                          min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>m</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="m" placeholder="m" type="number" step="0.01" min="0.00"
                                          max="1000.00"></b-form-input>
                        </b-col>

                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>q</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input v-model.number="q" placeholder="q" type="number" step="0.01"
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

                    <b-button variant="outline-primary" v-on:click="calculateKermackMakKendrick">
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
    import {calculatePath} from "../assets/gpaphUtils";
    import {kermackMakKendrick} from "../assets/kermackMakKendrick";
    import VueApexCharts from 'vue-apexcharts'

    export default {
        name: "KermackMakKendrick",
        components: {
            apexchart: VueApexCharts
        },
        data() {
            return {
                S: 10,
                I: 2,
                R: 1,
                b: 0.2,
                m: 1,
                q: 0.4,
                dataS: [],
                dataI: [],
                dataR: [],
                time: 30,
                timeStep: 0.1,
                lineS: '',
                lineI: '',
                lineR: '',
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
            calculateKermackMakKendrick() {
                this.calculateForTime(this.time)
                this.lineS = calculatePath(this.dataS)
                this.lineI = calculatePath(this.dataI)
                this.lineR = calculatePath(this.dataR)
                this.series = [
                    {
                        name: "S",
                        data: this.dataS
                    },
                    {
                        name: "I",
                        data: this.dataI
                    },
                    {
                        name: "R",
                        data: this.dataR
                    }
                ]
            },
            calculateForTime(t) {
                this.dataS = []
                this.dataI = []
                this.dataR = []
                let s = this.S
                let i = this.I
                let r = this.R
                this.dataS.push([0, s])
                this.dataI.push([0, i])
                this.dataI.push([0, r])
                for (let j = 1; j < t; j += this.timeStep) {
                    let res = kermackMakKendrick(s, i, r, this.b, this.m, this.q)
                    s = s + this.timeStep * res.ds
                    i = i + this.timeStep * res.di
                    r = r + this.timeStep * res.dr
                    this.dataS.push([j, s])
                    this.dataI.push([j, i])
                    this.dataR.push([j, r])
                }
            },
        }
    }
</script>

<style scoped>

</style>