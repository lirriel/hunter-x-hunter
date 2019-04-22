<template>
    <div>
        <h2>Kermack-MakKendrick model</h2>
        <b-row>
            <b-col sm="3">
                <div>
                    <b-row>
                        <b-col sm="4">
                            <label>S</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input placeholder="S" type="number" v-model.number="S"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>I</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input placeholder="I" type="number" v-model.number="I"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>R</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="R" step="0.01"
                                          type="number"
                                          v-model.number="R"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>b</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="b" step="0.01"
                                          type="number"
                                          v-model.number="b"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>m</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="m" step="0.01" type="number"
                                          v-model.number="m"></b-form-input>
                        </b-col>

                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>q</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="q" step="0.01"
                                          type="number"
                                          v-model.number="q"></b-form-input>
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
                        <b-button v-on:click="calculateKermackMakKendrick" variant="outline-primary">
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
        <behaviour-diargam :series="seriesBehave"></behaviour-diargam>
    </div>
</template>

<script>
    import {calculatePath} from "../assets/gpaphUtils";
    import {kermackMakKendrick} from "../assets/kermackMakKendrick";
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from './BehaviourDiargam'
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../assets/xlsx_utils";

    export default {
        name: "KermackMakKendrick",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam
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
                dataSToI: [],
                dataSToR: [],
                dataIToR: [],
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
                series: [],
                seriesBehave: []
            }
        },
        methods: {
            calculateKermackMakKendrick() {
                this.calculateForTime(this.time);
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
                ];
                this.seriesBehave = [
                    {
                        name: "S to I",
                        data: this.dataSToI
                    },
                    {
                        name: "S to R",
                        data: this.dataSToR
                    },
                    {
                        name: "I to R",
                        data: this.dataIToR
                    }
                ]
            },
            calculateForTime(t) {
                this.dataS = [];
                this.dataI = [];
                this.dataR = [];

                this.dataSToI = [];
                this.dataSToR = [];
                this.dataIToR = [];

                let s = this.S;
                let i = this.I;
                let r = this.R;

                this.dataS.push([0, s]);
                this.dataI.push([0, i]);
                this.dataR.push([0, r]);

                for (let j = this.timeStep; j < t; j += this.timeStep) {
                    let res = kermackMakKendrick(s, i, r, this.b, this.m, this.q);

                    s = s + this.timeStep * res.ds;
                    i = i + this.timeStep * res.di;
                    r = r + this.timeStep * res.dr;

                    this.dataS.push([j, s]);
                    this.dataI.push([j, i]);
                    this.dataR.push([j, r]);

                    this.dataSToI.push([i, s]);
                    this.dataSToR.push([r, s]);
                    this.dataIToR.push([r, i]);
                }
            },
            saveData() {
                var wb = createWorkbook();
                // add dataS
                var data = Array.from(this.dataS);
                data.splice(0, 0, ["S", "time"]);
                wb = createWorkSheet(wb, data, "dataS");
                // add dataI
                data = Array.from(this.dataI);
                data.splice(0, 0, ["I", "time"]);
                wb = createWorkSheet(wb, data, "dataI");
                // add dataR
                data = Array.from(this.dataR);
                data.splice(0, 0, ["R", "time"]);
                wb = createWorkSheet(wb, data, "dataR");
                // save
                saveWorkbook("test", wb);
            }
        }
    }
</script>

<style scoped>

</style>