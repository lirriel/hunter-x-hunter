<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-form-select :options="modelTypes" v-model="currentType" style="margin-bottom: 20px"/>
        <div>
            <b-row>
                <b-col sm="4">
                    <label>Susceptible</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input placeholder="S" type="number"
                                  v-model.number="S"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Infected</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input placeholder="I" type="number"
                                  v-model.number="I"></b-form-input>
                </b-col>
            </b-row>

            <b-row v-if="isSIS">
                <b-col sm="4">
                    <label>Recovered</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="R" step="0.01"
                                  type="number"
                                  v-model.number="R"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Chance to be infected</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="b" step="0.01"
                                  type="number"
                                  v-model.number="expKermackMcKendrick.b"></b-form-input>
                </b-col>
            </b-row>

            <b-row v-if="!isBasicSIR">
                <b-col sm="4">
                    <label>Birth rate</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="m" step="0.01" type="number"
                                  v-model.number="expKermackMcKendrick.m"></b-form-input>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Chance to be recovered</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="q" step="0.01"
                                  type="number"
                                  v-model.number="expKermackMcKendrick.q"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
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
        </div>
        <div style="margin-top: 10px">
            <b-button v-on:click="calculateKermackMakKendrick" variant="outline-primary">
                Calculate
            </b-button>
            <b-button v-on:click="saveData" variant="outline-primary">
                Save
            </b-button>
        </div>
        <div style="margin-top: 10px">
            <div style="margin-top: 20px">
                <b-button v-b-modal.modal-test-compare-kmk variant="outline-primary">Hold test</b-button>
            </div>
            <b-modal size="xl" id="modal-test-compare-kmk" title="parameter run test">
                <km-k-comparison-test-modal :params="Object.keys(expKermackMcKendrick)"
                                       :model="currentModel"
                                       :s="S"
                                       :i="I"
                                       :r="R"
                                       :time="time"
                                       :time-step="timeStep"
                />
            </b-modal>
        </div>
    </div>
</template>

<script>
    import {
        BasicSIR,
        KermackMakKendrick,
        KermackMakKendrickSIS
    } from "../../assets/kermackMakKendrick";
    import KmKComparisonTestModal from './KmKComparisonTestModal'
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";

    export default {
        name: "KermackMacKendrickController",
        components: {KmKComparisonTestModal},
        data() {
            return {
                S: 100,
                I: 10,
                R: 20,
                expKermackMcKendrick: {
                    S: 1000,
                    I: 2,
                    R: 10,
                    b: 0.01,
                    q: 0.8,
                    m: 1
                },
                modelTypes: ["Basic SIR", "SIR with repeat infection", "SIS"],
                currentType: "",
                currentModel: null,

                isBasicSIR: false,
                isSIR: false,
                isSIS: false,

                time: 2,
                timeStep: 0.01,

                dataS: [],
                dataI: [],
                dataR: [],

                dataSToI: [],
                dataSToR: [],
                dataIToR: [],

                isKermackMakKendrick: false,
            }
        },
        watch: {
            currentType: function (data) {
                this.update(data);
            }
        },
        methods: {
            update(data) {
                this.isBasicSIR = this.isSIR = this.isSIS = false;
                if (data === this.modelTypes[0]) {
                    this.isBasicSIR = true;
                    this.currentModel = new BasicSIR(
                        this.expKermackMcKendrick.b,
                        this.expKermackMcKendrick.q
                    );
                    this.R = 0;
                }
                if (data === this.modelTypes[1]) {
                    this.isKermackMakKendrick = true;
                    this.currentModel = new KermackMakKendrick(
                        this.expKermackMcKendrick.b,
                        this.expKermackMcKendrick.m,
                        this.expKermackMcKendrick.q
                    );
                    this.R = this.expKermackMcKendrick.R;
                }
                if (data === this.modelTypes[2]) {
                    this.currentModel = new KermackMakKendrickSIS(
                        this.expKermackMcKendrick.b,
                        this.expKermackMcKendrick.m,
                        this.expKermackMcKendrick.q
                    );
                    this.R = 0;
                }
                this.I = this.expKermackMcKendrick.I;
                this.S = this.expKermackMcKendrick.S;
            },
            calculateKermackMakKendrick() {
                this.update(this.currentType);
                this.calculateForTime(this.time);
                this.series = [
                    {
                        name: "Susceptible",
                        data: this.dataS
                    },
                    {
                        name: "Infected",
                        data: this.dataI
                    },
                    {
                        name: "Recovered",
                        data: this.dataR
                    }
                ];
                let _params = this.expKermackMcKendrick;
                this.$emit('series', {series: this.series, params: _params});
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
                ];
                this.$emit('seriesBehave', {series: this.seriesBehave, params: _params});
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
                    let res = this.currentModel.calculateModel(s, i, r);

                    s += this.timeStep * res.ds;
                    i +=this.timeStep * res.di;
                    r += this.timeStep * res.dr;

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
    label {
        font-size: smaller;
    }

    .b-row {
        margin-bottom: 10px;
    }
</style>