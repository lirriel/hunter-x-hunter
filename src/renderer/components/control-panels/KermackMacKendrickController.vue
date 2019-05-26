<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-form-select :options="modelTypes" style="margin-bottom: 20px" v-model="currentType"/>
        <div>
            <b-row>
                <b-col sm="4">
                    <label>Susceptible</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(S, 0, 100000)" aria-describedby="input-msg-1"
                                  placeholder="S" type="number"
                                  v-model.number="S"/>
                    <b-form-invalid-feedback id="input-msg-1">
                        {{areaMsg(0, 100000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Infected</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(I, 0, 10000)" aria-describedby="input-msg-2"
                                  placeholder="I" type="number"
                                  v-model.number="I"/>
                    <b-form-invalid-feedback id="input-msg-2">
                        {{areaMsg(0, 10000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row v-if="isSIS">
                <b-col sm="4">
                    <label>Recovered</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(timeStep, 0, 10000)"
                                  aria-describedby="input-msg-3" max="1000.00" min="0.00"
                                  placeholder="R" step="0.01"
                                  type="number"
                                  v-model.number="R"/>
                    <b-form-invalid-feedback id="input-msg-3">
                        {{areaMsg(0, 10000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Chance to be infected</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(expKermackMcKendrick.b, 0, 1000)"
                                  aria-describedby="input-msg-4" max="1000.00" min="0.00"
                                  placeholder="b" step="0.01"
                                  type="number"
                                  v-model.number="expKermackMcKendrick.b"/>
                    <b-form-invalid-feedback id="input-msg-4">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Chance to be recovered</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(expKermackMcKendrick.q, 0, 1000)"
                                  aria-describedby="input-msg-5" max="1000.00" min="0.00"
                                  placeholder="q" step="0.01"
                                  type="number"
                                  v-model.number="expKermackMcKendrick.q"/>
                    <b-form-invalid-feedback id="input-msg-5">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row v-if="!isBasicSIR">
                <b-col sm="4">
                    <label>Immunity loss rate</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(expKermackMcKendrick.m, 0, 1000)"
                                  aria-describedby="input-msg-6" max="1000.00" min="0.00"
                                  placeholder="m" step="0.01" type="number"
                                  v-model.number="expKermackMcKendrick.m"/>
                    <b-form-invalid-feedback id="input-msg-6">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>

            </b-row>

            <b-row v-if="currentType === 'SIRS with vital dynamics'">
                <b-col sm="4">
                    <label>Birth rate</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(expKermackMcKendrick.v, 0, 1000)"
                                  aria-describedby="input-msg-7" max="1000.00" min="0.00"
                                  placeholder="m" step="0.01" type="number"
                                  v-model.number="expKermackMcKendrick.v"/>
                    <b-form-invalid-feedback id="input-msg-7">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>

            </b-row>
            <b-row v-if="currentType === 'SIRS with vital dynamics'">
                <b-col sm="4">
                    <label>Morality rate</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(expKermackMcKendrick.mor, 0, 1000)"
                                  aria-describedby="input-msg-8" max="1000.00" min="0.00"
                                  placeholder="m" step="0.01" type="number"
                                  v-model.number="expKermackMcKendrick.mor"/>
                    <b-form-invalid-feedback id="input-msg-8">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(time, 0, 1000)"
                                  aria-describedby="input-msg-9" max="1000.00" min="0.00"
                                  placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"/>
                    <b-form-invalid-feedback id="input-msg-9">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input :state="checkRange(timeStep, 0, time)"
                                  aria-describedby="input-msg-10" max="1000.00" min="0.00"
                                  placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"/>
                    <b-form-invalid-feedback id="input-msg-10">
                        {{areaMsg(0, 1000)}}
                    </b-form-invalid-feedback>
                </b-col>
            </b-row>
        </div>
        <vs-divider/>
        <div v-if="currentModel">
            <b-button v-b-toggle.formula variant="outline-info">Show formula
            </b-button>
            <b-collapse class="mt-2" id="formula">
                <b-card>
                    <katex-element :expression='currentModel.getFormula()'
                                   max-size="\rule{10px}{10px}"/>
                </b-card>
            </b-collapse>
        </div>
        <vs-divider/>
        <div style="margin-top: 10px">
            <b-button v-on:click="calculateKermackMakKendrick" variant="outline-primary">
                <i class="fas fa-calculator"></i>
                Calculate
            </b-button>
            <b-button v-on:click="addToChart" variant="outline-info">
                <i class="fas fa-greater-than"></i>
            </b-button>
            <b-button v-on:click="removeChart" variant="outline-danger">
                <i class="far fa-window-close"></i>
            </b-button>
            <b-button style="margin-left: 10px" v-on:click="saveData" variant="outline-success">
                <i class="fas fa-file-excel"></i>
                Save Data
            </b-button>
        </div>
        <vs-divider/>
        <div style="margin-top: 10px">
            <div style="margin-top: 20px">
                <b-button v-b-modal.modal-test-compare-kmk variant="outline-primary">
                    <i class="fas fa-rocket"></i>Start tests
                </b-button>
            </div>
            <b-modal id="modal-test-compare-kmk" scrollable size="xl" title="parameter run test">
                <km-k-comparison-test-modal :i="I"
                                            :model="currentModel"
                                            :params="Object.keys(expKermackMcKendrick)"
                                            :r="R"
                                            :s="S"
                                            :time="time"
                                            :time-step="timeStep"/>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import {
        BasicSIR,
        KermackMakKendrickSIS,
        SIRS,
        SIRSwithVital
    } from "../../assets/kermackMakKendrick";
    import KmKComparisonTestModal from './modals/KmKComparisonTestModal'
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";
    import {setNumber} from "../../assets/pdfUtils";

    export default {
        name: "KermackMacKendrickController",
        components: {KmKComparisonTestModal},
        data() {
            return {
                S: 100,
                I: 10,
                R: 0,
                expKermackMcKendrick: {
                    S: 1000,
                    I: 2,
                    R: 0,
                    b: 0.01,
                    q: 0.8,
                    m: 1,
                    v: 0,
                    mor: 0
                },
                modelTypes: ["Basic SIR", "SIR with repeat infection", "SIS", "SIRS with vital dynamics"],
                currentType: "Basic SIR",
                currentModel: new BasicSIR(0.01, 0.8),

                isBasicSIR: true,
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
                },

            }
        },
        watch: {
            currentType: function (data) {
                this.update(data);
            }
        },
        methods: {
            checkRange(value, min, max) {
                return value >= min && value <= max;
            },
            areaMsg(min, max) {
                return `Value should between ${min} and ${max}`
            },
            addToChart() {
                this.$emit('addToChart', [...this.series]);
            },
            removeChart() {
                this.$emit('removeChart', true);
            },
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
                if (data === this.modelTypes[3]) {
                    this.currentModel = new SIRSwithVital(
                        this.expKermackMcKendrick.b,
                        this.expKermackMcKendrick.m,
                        this.expKermackMcKendrick.q,
                        this.expKermackMcKendrick.v,
                        this.expKermackMcKendrick.mor,
                    )
                }
                this.$emit('model', {model: this.currentModel})
            },
            calculateKermackMakKendrick() {
                this.update(this.currentType);
                this.calculateForTime(this.time).then(result => {
                    this.dataS = result.s;
                    this.dataI = result.i;
                    this.dataR = result.r;
                    this.dataSToI = result.si;
                    this.dataSToR = result.sr;
                    this.dataIToI = result.ir;
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
                })
            },
            calculateForTime(t) {
                let that = this;
                return new Promise(resolve => {
                    let dataS = [];
                    let dataI = [];
                    let dataR = [];

                    let dataSToI = [];
                    let dataSToR = [];
                    let dataIToR = [];

                    let s_0 = that.S;

                    let s = that.S;
                    let i = that.I;
                    let r = that.R;

                    that.getMessage();

                    dataS.push([0, s]);
                    dataI.push([0, i]);
                    dataR.push([0, r]);

                    let pr = i;
                    that.epidemicInfo.peak = [-1, -1];

                    for (let j = 0; j < t; j += that.timeStep) {
                        let res = that.currentModel.calculateModel(s, i, r);
                        s += that.timeStep * res.ds;
                        let di = that.timeStep * res.di;
                        i += di;
                        r += that.timeStep * res.dr;

                        if (s <= 0 || i <= 0) {
                            break;
                        }

                        if ((di * pr <= 0 || di === 0) && that.epidemicInfo.peak[1] < i) {
                            that.epidemicInfo.peak = [j, i]
                        }
                        pr = that.timeStep * res.di;

                        if (Math.abs(i - r) <= 1) {
                            that.epidemicInfo.recoverThreshold = [j, i]
                        }
                        if (Math.abs(s - i) <= 1) {
                            that.epidemicInfo.outbreakThreshold = [j, i]
                        }

                        dataS.push([j, setNumber(s)]);
                        dataI.push([j, setNumber(i)]);
                        dataR.push([j, setNumber(r)]);

                        dataSToI.push([setNumber(s), setNumber(i)]);
                        dataSToR.push([setNumber(s), setNumber(r)]);
                        dataIToR.push([setNumber(r), setNumber(i)]);
                    }

                    that.drawPhaseTrajectories();
                    that.drawBehaveCurve(s_0);
                    resolve({
                        s: dataS,
                        i: dataI,
                        r: dataR,
                        si: dataSToI,
                        sr: dataIToR,
                        ir: dataIToR
                    })
                })
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
        font-family: 'Karla', sans-serif;
        font-size: smaller;
    }

    .row {
        margin-bottom: 10px;
    }
</style>