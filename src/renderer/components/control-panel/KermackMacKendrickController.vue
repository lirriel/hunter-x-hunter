<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-form-select :options="modelTypes" style="margin-bottom: 20px" v-model="currentType"/>
        <div>
            <b-row>
                <b-col sm="4">
                    <label>Susceptible</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input placeholder="S" type="number"
                                  v-model.number="S"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Infected</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input placeholder="I" type="number"
                                  v-model.number="I"/>
                </b-col>
            </b-row>

            <b-row v-if="isSIS">
                <b-col sm="4">
                    <label>Recovered</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="R" step="0.01"
                                  type="number"
                                  v-model.number="R"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Chance to be infected</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="b" step="0.01"
                                  type="number"
                                  v-model.number="expKermackMcKendrick.b"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Chance to be recovered</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="q" step="0.01"
                                  type="number"
                                  v-model.number="expKermackMcKendrick.q"/>
                </b-col>
            </b-row>

            <b-row v-if="!isBasicSIR">
                <b-col sm="4">
                    <label>Birth rate</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="m" step="0.01" type="number"
                                  v-model.number="expKermackMcKendrick.m"/>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"/>
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
                                  v-model.number="timeStep"/>
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
                <b-button v-b-modal.modal-test-compare-kmk variant="outline-primary">
                    Hold test
                </b-button>
            </div>
            <b-modal id="modal-test-compare-kmk" size="xl" title="parameter run test">
                <km-k-comparison-test-modal :i="I"
                                            :model="currentModel"
                                            :params="Object.keys(expKermackMcKendrick)"
                                            :r="R"
                                            :s="S"
                                            :time="time"
                                            :time-step="timeStep"
                />
            </b-modal>
        </div>
    </div>
</template>

<script>
    import {BasicSIR, KermackMakKendrickSIS, SIRS} from "../../assets/kermackMakKendrick";
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
                currentType: "Basic SIR",
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

                phaseTrajSeries: [],

                isKermackMakKendrick: false,


                epidemicInfo: {
                    peak: [0, 0],
                    recoverThreshold: [0, 0],
                    outbreakThreshold: [0, 0],
                }
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
                    this.currentModel = new SIRS(
                        this.expKermackMcKendrick.b,
                        this.expKermackMcKendrick.m,
                        this.expKermackMcKendrick.q
                    );
                }
                if (data === this.modelTypes[2]) {
                    this.currentModel = new KermackMakKendrickSIS(
                        this.expKermackMcKendrick.b,
                        this.expKermackMcKendrick.m,
                        this.expKermackMcKendrick.q
                    );
                    this.R = 0;
                }
            },
            calculateKermackMakKendrick() {
                this.update(this.currentType);
                this.calculateForTime(this.time);
                let r0 = this.currentModel.getBasicReproductionNumber(this.S);
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
                this.$emit('r0', this.currentModel.getBasicReproductionNumber(this.S));
                let eq = this.currentModel.getEquilibrium(this.S, this.I, this.R);
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
                    },
                    {
                        name: "Equilibrium Points",
                        type: 'line',
                        data: eq
                    }
                ];
                this.$emit('seriesBehave', {series: this.seriesBehave, params: _params});
                this.$emit('epidemicInfo', this.epidemicInfo)
            },
            calculateForTime(t) {
                this.dataS = [];
                this.dataI = [];
                this.dataR = [];

                this.dataSToI = [];
                this.dataSToR = [];
                this.dataIToR = [];

                let s_0 = this.S;

                let s = this.S;
                let i = this.I;
                let r = this.R;

                this.getMessage();

                this.dataS.push([0, s]);
                this.dataI.push([0, i]);
                this.dataR.push([0, r]);

                let pr = i;
                this.epidemicInfo.peak = [-1, -1];

                for (let j = 0; j < t; j += this.timeStep) {
                    let res = this.currentModel.calculateModel(s, i, r);

                    s += this.timeStep * res.ds;
                    let di = this.timeStep * res.di;
                    i += di;
                    r += this.timeStep * res.dr;

                    if ((di * pr <= 0 || di === 0) && this.epidemicInfo.peak[1] < i) {
                        this.epidemicInfo.peak = [j, i]
                    }
                    pr = this.timeStep * res.di;

                    if (Math.abs(i - r) <= 0.05) {
                        this.epidemicInfo.recoverThreshold = [j, i]
                    }
                    if (Math.abs(s - i) <= 0.05) {
                        this.epidemicInfo.outbreakThreshold = [j, i]
                    }

                    this.dataS.push([j, s]);
                    this.dataI.push([j, i]);
                    this.dataR.push([j, r]);

                    this.dataSToI.push([s, i]);
                    this.dataSToR.push([s, r]);
                    this.dataIToR.push([r, i]);
                }

                this.drawPhaseTrajectories();
                this.drawBehaveCurve(s_0);
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
            },
            drawPhaseTrajectories() {
                let arr = [];
                if (this.currentModel instanceof BasicSIR) {
                    for (let i = 0; i < this.dataSToI.length; i++) {
                        arr.push([
                            this.dataSToI[0],
                            this.currentModel.getPhaseTrajectories(
                                this.currentModel[0], this.currentModel[1]
                            )
                        ]);
                    }
                }
                this.phaseTrajSeries = [
                    {
                        data: arr,
                        name: "phase trajectories"
                    },
                    {
                        name: "S to I",
                        data: this.dataSToI
                    }
                ]
            },
            getMessage() {
                let msg = this.currentModel.getAnalysis(this.S, this.I, 0.05);
                msg += ". Epidemological Threshold Analysis: "
                    + this.currentModel.getEpidemicThresholdAnalysis(this.S);
                if (this.isSIS === true) {
                    msg += ". Spread analysis of SIS: "
                        + this.currentModel.spreadAnalysis(this.S);
                }
                this.$emit("message", msg + ".");
            },
            drawBehaveCurve(s_0) {
                if (this.currentModel instanceof KermackMakKendrickSIS) {
                    this.$emit("behaveCurve", {flag: false, series: []})
                } else {
                    let arr = [];
                    for (let i = 0; i < this.dataS.length; i++) {
                        arr.push(this.currentModel.getBehaveCurve(
                            this.dataS[i][1],
                            this.dataI[i][1],
                            this.dataR[i][1],
                            s_0
                        ))
                    }
                    this.$emit("behaveCurve", {
                        flag: true,
                        series: [{
                            name: "Behave curve",
                            data: [...arr]
                        }]
                    });
                }
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