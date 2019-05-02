<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-row>
            <b-col sm="4">
                <label>Bacteria biomass</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="Bacteria" step="0.01"
                              type="number" v-model.number="expJMonod.x"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>Nutrient (S)</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="S" step="0.01" type="number"
                              v-model.number="expJMonod.s"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>Input nutrient flow(S-input)</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="S-in" step="0.01"
                              type="number"
                              v-model.number="expJMonod.sIn"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>q</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="q" step="0.01"
                              type="number"
                              v-model.number="expJMonod.q"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>Dilution rate (dr)</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="dr" step="0.01" type="number"
                              v-model.number="expJMonod.dr"></b-form-input>
            </b-col>

        </b-row>

        <b-row>
            <b-col sm="4">
                <label>Growth rate uptake (alpha)</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="alpha" step="0.01"
                              type="number"
                              v-model.number="expJMonod.alpha"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>Saturation const (K)</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="k" step="0.01"
                              type="number"
                              v-model.number="expJMonod.k"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>mu-Max growth rate</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="muMax" step="0.01"
                              type="number"
                              v-model.number="expJMonod.muMax"></b-form-input>
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
</template>

<script>
    import {jacobMonod} from "../../assets/jacobMonod";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";

    export default {
        name: "JacobMonodController",
        data() {
            return {
                expJMonod: {
                    x: 12,
                    s: 4,
                    sIn: 0.9,
                    q: 1.3,
                    dr: 0.2,
                    alpha: 0.45,
                    k: 0.3,
                    muMax: 0.9,
                },
                dataX: [],
                dataS: [],
                dataXToS: [],
                timeArray: [],
                series: [],
                seriesBehave: [],
                time: 5,
                timeStep: 0.2,
                ///////////////////////////////////
                isJMonod: true
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
                let _params = null;
                if (this.isJMonod === true) {
                    _params = this.expJMonod;
                }
                this.$emit("series", {series: this.series, params: _params});
                this.seriesBehave = [
                    {
                        name: "Bacteria behave",
                        data: this.dataXToS
                    }
                ];
                this.$emit("seriesBehave", {series: this.seriesBehave, params: _params});
            },
            calculateForTime(t) {
                this.dataX = [];
                this.dataS = [];

                this.dataXToS = [];

                let xValue = this.expJMonod.x;
                let sValue = this.expJMonod.s;

                this.dataX.push([0, xValue]);
                this.dataS.push([0, sValue]);

                this.dataXToS.push([sValue, xValue]);

                for (let j = this.timeStep; j < t; j += this.timeStep) {
                    let res = null;
                    if (this.isJMonod === true) {
                        res = jacobMonod(xValue, sValue,
                            this.expJMonod.sIn,
                            this.expJMonod.q,
                            this.expJMonod.dr,
                            this.expJMonod.alpha,
                            this.standardMuFunction
                        );
                    }

                    xValue = xValue + this.timeStep * res.dx;
                    sValue = sValue + this.timeStep * res.ds;

                    this.dataX.push([j, xValue]);
                    this.dataS.push([j, sValue]);

                    // this.dataXToS.push([sValue, xValue]);
                    this.dataXToS.push([xValue, sValue]);
                }
            },
            standardMuFunction(_s) {
                return this.expJMonod.muMax * _s / (_s + this.expJMonod.k);
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
    label {
        font-size: smaller;
    }

    .b-row {
        margin-bottom: 10px;
    }
</style>