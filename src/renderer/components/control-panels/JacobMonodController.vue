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
                              v-model.number="expJMonod.K"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="4">
                <label>mu-Max growth rate</label>
            </b-col>
            <b-col sm="8">
                <b-form-input max="1000.00" min="0.00" placeholder="muMax" step="0.01"
                              type="number"
                              v-model.number="expJMonod.mMax"></b-form-input>
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
                <i class="fas fa-calculator"></i>
                Calculate
            </b-button>
            <br>
            <b-button style="margin-top: 10px" v-on:click="saveData" variant="outline-success">
                <i class="fas fa-file-excel"></i>
                Save Data
            </b-button>
            <vs-divider/>
            <div style="margin-top: 20px">
                <b-button v-b-modal.modal-test-compare-jm variant="outline-primary">
                    <i class="fas fa-rocket"></i>Start tests
                </b-button>
            </div>
            <b-modal id="modal-test-compare-jm" scrollable size="xl" title="parameter run test">
                <j-monod-comparison-test-modal :model="model"
                                               :params="Object.keys(expJMonod)"
                                               :s="expJMonod.s"
                                               :time="time"
                                               :time-step="timeStep"
                                               :x="expJMonod.x"
                />
            </b-modal>
        </div>
    </div>
</template>

<script>
    import {JacobMonod} from "../../assets/jacobMonod";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";
    import JMonodComparisonTestModal from './modals/JMonodComparisonTestModal'
    import {setNumber} from "../../assets/pdfUtils";

    export default {
        name: "JacobMonodController",
        components: {JMonodComparisonTestModal},
        data() {
            return {
                expJMonod: {
                    x: 12,
                    s: 4,
                    sIn: 0.9,
                    dr: 0.2,
                    alpha: 0.45,
                    K: 0.3,
                    mMax: 0.9,
                },
                dataX: [],
                dataS: [],
                dataXToS: [],

                series: [],
                seriesBehave: [],
                seriesMonodCurve: [],

                time: 5,
                timeStep: 0.2,

                model: null,
                isJMonod: true
            }
        },
        methods: {
            calculateJMonod() {
                this.model = new JacobMonod(
                    this.expJMonod.sIn,
                    this.expJMonod.dr,
                    this.expJMonod.alpha,
                    this.expJMonod.mMax,
                    this.expJMonod.K
                );
                this.$emit('model', {model: this.currentModel});
                this.calculateForTime(this.time).then(result => {
                    this.dataX = result.x;
                    this.dataS = result.s;
                    this.dataXToS = result.behave;
                    this.series = [
                        {
                            name: "bacteria",
                            data: this.dataX
                        },
                        {
                            name: "nutrient",
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
                })
            },
            calculateForTime(t) {
                let that = this;
                return new Promise(resolve => {
                    let dataX = [];
                    let dataS = [];
                    let dataXToS = [];

                    let xValue = that.expJMonod.x;
                    let sValue = that.expJMonod.s;
                    let mCurve = [];

                    dataX.push([0, xValue]);
                    dataS.push([0, sValue]);
                    dataXToS.push([sValue, xValue]);

                    for (let j = that.timeStep; j < t; j += that.timeStep) {
                        let res = that.model.calculateModel(xValue, sValue);

                        xValue += that.timeStep * res.dx;
                        sValue += that.timeStep * res.ds;

                        mCurve.push([sValue, that.model.getMonodCurve(setNumber(sValue))]);

                        dataX.push([j, setNumber(xValue)]);
                        dataS.push([j, setNumber(sValue)]);
                        dataXToS.push([setNumber(sValue), setNumber(xValue)]);
                    }
                    that.$emit("curve", [{
                        name: "monod curve",
                        data: [...mCurve]
                    }]);
                    resolve({x: dataX, s: dataS, behave: dataXToS})
                })
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
        font-family: 'Karla', sans-serif;
        font-size: smaller;
    }

    .row {
        margin-bottom: 10px;
    }
</style>