<template>
    <div>
        <h2>J.Monod Chemostat model</h2>
        <b-row>
            <b-col sm="3">
                <div>
                    <b-row>
                        <b-col sm="4">
                            <label>Bacteria biomass</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="Bacteria" step="0.01"
                                          type="number" v-model.number="x"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Nutrient (S)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="S" step="0.01" type="number"
                                          v-model.number="s"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Input nutrient flow(S-input)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="S-in" step="0.01"
                                          type="number"
                                          v-model.number="sIn"></b-form-input>
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
                            <label>Dilution rate (dr)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="dr" step="0.01" type="number"
                                          v-model.number="dr"></b-form-input>
                        </b-col>

                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Growth rate uptake (alpha)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="alpha" step="0.01"
                                          type="number"
                                          v-model.number="alpha"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>Saturation const (K)</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="k" step="0.01"
                                          type="number"
                                          v-model.number="k"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col sm="4">
                            <label>mu-Max growth rate</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input max="1000.00" min="0.00" placeholder="muMax" step="0.01"
                                          type="number"
                                          v-model.number="muMax"></b-form-input>
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
                        <b-button v-on:click="calculateJMonod" variant="outline-primary">
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
    import VueApexCharts from 'vue-apexcharts'
    import BehaviourDiargam from './diagrams/BehaviourDiargam'
    import {jacobMonod} from "../assets/jacobMonod";

    export default {
        name: "JacobMonod",
        components: {
            apexchart: VueApexCharts,
            BehaviourDiargam
        },
        data() {
            return {
                x: 12,
                s: 4,
                sIn: 0.9,
                q: 1.3,
                dr: 0.2,
                alpha: 0.45,
                k: 0.3,
                muMax: 0.9,
                dataX: [],
                dataS: [],
                dataXToS: [],
                timeArray: [],
                time: 5,
                timeStep: 0.2,
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
            calculateJMonod() {
                this.calculateForTime(this.time);
                this.series = [
                    {
                        name: "Bacteria biomass",
                        data: this.dataX
                    },
                    {
                        name: "S",
                        data: this.dataS
                    }
                ];
                this.seriesBehave = [
                    {
                        name: "Bacteria behave",
                        data: this.dataXToS
                    }
                ]
            },
            calculateForTime(t) {
                this.dataX = [];
                this.dataS = [];

                this.dataXToS = [];

                let xValue = this.x;
                let sValue = this.s;

                this.dataX.push([0, xValue]);
                this.dataS.push([0, sValue]);

                this.dataXToS.push([sValue, xValue]);

                for (let j = this.timeStep; j < t; j += this.timeStep) {
                    let res = jacobMonod(xValue, sValue, this.sIn, this.q, this.dr, this.alpha, this.standardMuFunction);

                    xValue = xValue + this.timeStep * res.dx;
                    sValue = sValue + this.timeStep * res.ds;

                    this.dataX.push([j, xValue]);
                    this.dataS.push([j, sValue]);

                    // this.dataXToS.push([sValue, xValue]);
                    this.dataXToS.push([xValue, sValue]);
                }
            },
            standardMuFunction(_s) {
                return this.muMax * _s / (_s + this.k);
            },
            saveData() {
                var wb = createWorkbook();
                // add data X
                var data = Array.from(this.dataX);
                data.splice(0, 0, ["bacteria biomass", "time"]);
                wb = createWorkSheet(wb, data, "biomass change");
                // add data S
                data = Array.from(this.dataS);
                data.splice(0, 0, ["output S", "time"]);
                wb = createWorkSheet(wb, data, "output S");
                // save
                saveWorkbook("test", wb);
            }
        }
    }
</script>

<style scoped>

</style>