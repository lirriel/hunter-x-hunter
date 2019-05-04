<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <b-form-select :options="lvModelTypes" v-model="currentType" style="margin-bottom: 20px"/>

        <div v-if="isLotkaVolterra || isLotkaVolterraQuadratic">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Prey birth rate (Alpha)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Alpha" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.a"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Impact of predation (Gamma 1)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Gamma 1" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.g1"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator Death rate (Beta)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Beta" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.b"></b-form-input>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Growth in predator (Gamma 2)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Gamma 2" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterra.g2"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraFiniteCapacity">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Prey birth rate (Alpha)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Alpha" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.a"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Impact of predation (Gamma 1)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Gamma 1" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.g1"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator Death rate (Beta)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Beta" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.b"></b-form-input>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Growth in predator (Gamma 2)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Gamma 2" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.g2"></b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="4">
                    <label>Predator capacity (K)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraFiniteCapacity.K"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraContTime">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(r)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  v-model.number="experimentLotkaVolterraContTime.r"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(k)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.k"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(a)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.a"/>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(c)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.c"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(b)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.b"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(d)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContTime.d"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isRosenzweigMacArthur">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(k)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  v-model.number="experimentRosenzweigMacArthur.k"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(m)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentRosenzweigMacArthur.m"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(c)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentRosenzweigMacArthur.c"/>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div v-if="isLotkaVolterraContiniousTimeAlleeEffect">
            <b-row>
                <b-col sm="4">
                    <label>Prey</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Prey" type="number"
                                  v-model.number="prey"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Predator</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input placeholder="Predator" type="number"
                                  v-model.number="predator"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(r)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01" type="number"
                                  v-model.number="experimentLotkaVolterraContiniousTimeAlleeEffect.r"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(a)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContiniousTimeAlleeEffect.a"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>(b)</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.01"
                                  type="number"
                                  v-model.number="experimentLotkaVolterraContiniousTimeAlleeEffect.b"/>
                </b-col>

            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time" step="0.01"
                                  type="number"
                                  v-model.number="time"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="4">
                    <label>Time step</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" placeholder="Time step"
                                  step="0.00000001"
                                  type="number"
                                  v-model.number="timeStep"></b-form-input>
                </b-col>
            </b-row>
        </div>
        <div style="margin-top: 10px">
            <b-button v-on:click="calculateLotkaVolterra" variant="outline-primary">
                Calculate
            </b-button>
            <b-button v-on:click="saveData" variant="outline-primary">
                Save
            </b-button>
            <b-button v-on:click="savePdf" variant="outline-primary">Save Pdf</b-button>
            <b-button v-on:click="compare" variant="outline-warning">
                Compare
            </b-button>
            <b-button v-on:click="getBifurcationD" variant="outline-warning">generate</b-button>
        </div>
        <div style="margin-top: 20px">
            <b-button v-b-modal.modal-test-compare variant="outline-primary">Hold test</b-button>
        </div>
        <b-modal size="xl" id="modal-test-compare" title="parameter run test">
            <comparison-test-modal :params="currentExperimentParams"
                                   :model="currentModel"
                                   :prey="prey"
                                   :predator="predator"
                                   :time="time"
                                   :time-step="timeStep"
            />
        </b-modal>
    </div>
</template>

<script>
    import {
        BasicLotkaVolterra,
        LotkaVolterraContiniousTimeAlleeEffect,
        LotkaVolterraContiniousTimeFiniteCapacity,
        LotkaVolterraFiniteCapacity,
        RosenzweigMacArthur,
    } from "../../assets/lotkaVolterra";
    import {createWorkbook, createWorkSheet, saveWorkbook} from "../../assets/xlsx_utils";
    import ComparisonTestModal from './ComparisonTestModal'

    export default {
        name: "LotkaVolterraControlPanel",
        components: {
            ComparisonTestModal
        },
        data() {
            return {
                lvModelTypes: [
                    'Lotka-Volterra',
                    'Lotka-Volterra with continuous time',
                    'Rosenzweig and MacArthur model',
                    'Lotka-Volterra finite capacity',
                    'Lotka-Volterra Continious Time with Allee Effect'
                ],
                currentType: '',
                experimentLotkaVolterra: {
                    prey: 20,
                    predator: 3,
                    a: 0.9,
                    g1: 0.3,
                    b: 0.6,
                    g2: 0.06,
                },
                experimentLotkaVolterraFiniteCapacity: {
                    prey: 20,
                    predator: 3,
                    a: 0.9,
                    g1: 0.3,
                    b: 0.6,
                    g2: 0.06,
                    K: 5
                },
                time: 10,
                timeStep: 0.1,
                prey: 10,
                predator: 10,
                experimentLotkaVolterraContTime: {
                    prey: 20,
                    predator: 3,
                    r: 0.6,
                    k: 126,
                    a: 0.6,
                    c: 0.06,
                    b: 0.56,
                    d: 0.56,
                },
                experimentRosenzweigMacArthur: {
                    prey: 1,
                    predator: 1,
                    k: 2,
                    m: 3,
                    c: 4
                },
                experimentLotkaVolterraContiniousTimeAlleeEffect: {
                    prey: 0.005,
                    predator: 0.01,
                    r: 2.5,
                    a: 17,
                    b: 0.05
                },
                compareFlag: false,
                dataPrey: [],
                compareDataPrey: [],
                dataPredator: [],
                compareDataPredator: [],
                dataBehave: [],
                dataBifurcation: [],
                series: [],
                seriesCompare: [],
                seriesBehave: [],
                seriesBifurcation: [],
                selectParameter: ['alpha', 'beta', 'gamma1', 'gamma2'],
                bifurcationParam: 'alpha',
                bifurcationStartValue: 0.0001,
                bifurcationMaxValue: 5,
                bifurcationStep: 0.001,
                isLotkaVolterra: false,
                isLotkaVolterraContTime: false,
                isRosenzweigMacArthur: false,
                isLotkaVolterraFiniteCapacity: false,
                isLotkaVolterraQuadratic: false,
                isLotkaVolterraContiniousTimeAlleeEffect: false,
                ////////////////////////////////
                currentModel: null,
                currentExperimentParams: null,
            }
        },
        watch: {
            currentType: function (data) {
                this.isRosenzweigMacArthur =
                    this.isLotkaVolterra =
                        this.isLotkaVolterraContTime =
                            this.isLotkaVolterraFiniteCapacity =
                                this.isLotkaVolterraQuadratic =
                                    this.isLotkaVolterraContiniousTimeAlleeEffect = false;

                this.assignParams(data);
            }
        },
        methods: {
            assignParams(data) {
                if (data === this.lvModelTypes[0]) {
                    this.isLotkaVolterra = true;
                    this.currentModel = new BasicLotkaVolterra(
                        this.experimentLotkaVolterra.a,
                        this.experimentLotkaVolterra.g1,
                        this.experimentLotkaVolterra.b,
                        this.experimentLotkaVolterra.g2
                    );
                    this.currentExperimentParams = this.experimentLotkaVolterra;
                }
                if (data === this.lvModelTypes[1]) {
                    this.isLotkaVolterraContTime = true;
                    this.currentModel = new LotkaVolterraContiniousTimeFiniteCapacity(
                        this.experimentLotkaVolterraContTime.r,
                        this.experimentLotkaVolterraContTime.k,
                        this.experimentLotkaVolterraContTime.a,
                        this.experimentLotkaVolterraContTime.c,
                        this.experimentLotkaVolterraContTime.b,
                        this.experimentLotkaVolterraContTime.d);
                    this.currentExperimentParams = this.experimentLotkaVolterraContTime;
                }
                if (data === this.lvModelTypes[2]) {
                    this.isRosenzweigMacArthur = true;
                    this.currentModel = new RosenzweigMacArthur(
                        this.experimentRosenzweigMacArthur.k,
                        this.experimentRosenzweigMacArthur.m,
                        this.experimentRosenzweigMacArthur.c);
                    this.currentExperimentParams = this.experimentRosenzweigMacArthur;
                }
                if (data === this.lvModelTypes[3]) {
                    this.isLotkaVolterraFiniteCapacity = true;
                    this.currentModel = new LotkaVolterraFiniteCapacity(
                        this.experimentLotkaVolterraFiniteCapacity.a,
                        this.experimentLotkaVolterraFiniteCapacity.g1,
                        this.experimentLotkaVolterraFiniteCapacity.b,
                        this.experimentLotkaVolterraFiniteCapacity.g2,
                        this.experimentLotkaVolterraFiniteCapacity.K);
                    this.currentExperimentParams = this.experimentLotkaVolterraFiniteCapacity;
                }
                if (data === this.lvModelTypes[4]) {
                    this.isLotkaVolterraContiniousTimeAlleeEffect = true;
                    this.currentModel = new LotkaVolterraContiniousTimeAlleeEffect(
                        this.experimentLotkaVolterraContiniousTimeAlleeEffect.r,
                        this.experimentLotkaVolterraContiniousTimeAlleeEffect.a,
                        this.experimentLotkaVolterraContiniousTimeAlleeEffect.b);
                    this.currentExperimentParams = this.experimentLotkaVolterraContiniousTimeAlleeEffect;
                }
            },
            calculateLotkaVolterra() {
                this.assignParams(this.currentType);
                this.calculateForTime(this.time);
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
                this.$emit('series', {series: this.series, params: this.experimentLotkaVolterra});
                this.$emit('modelType', this.currentType);
                let vArray = [];
                for (let i = 0; i < this.dataBehave.length; i++) {
                    // let v = this.currentModel.phaseSpacePlot(
                    //     this.dataBehave[i][0],
                    //     this.dataBehave[i][1]
                    // );
                    // vArray.push([this.dataBehave[i][1], this.dataBehave[i][0], v]);
                }
                let eq = this.currentModel.getEquilibrium();
                console.log(eq);
                this.seriesBehave = [
                    {
                        name: "Behaviour",
                        type: 'line',
                        data: this.dataBehave
                    },
                    {
                        name: "Equilibrium Points",
                        type: 'line',
                        data: eq
                    }
                ];
                this.$emit('behaviour', this.seriesBehave);
            },
            calculateForTime(t) {
                this.dataPrey = [];
                this.dataPredator = [];
                this.dataBehave = [];

                let x = this.prey;
                let y = this.predator;

                this.dataPrey.push([0, x]);
                this.dataPredator.push([0, y]);
                this.dataBehave.push([y, x]);

                for (let i = this.timeStep; i < t; i += this.timeStep) {
                    let res = this.currentModel.calculateModel(x, y);
                    x += this.timeStep * res.prey;
                    y += this.timeStep * res.predator;

                    this.dataPrey.push([i, x]);
                    this.dataPredator.push([i, y]);
                    this.dataBehave.push([x, y])
                }
            },
            getBifurcationD() {
                this.dataBifurcation = [];
                var x = this.prey;
                var y = this.predator;
                for (var i = this.bifurcationStartValue; i <= this.bifurcationMaxValue; i += this.bifurcationStep) {
                    var res = {prey: 0, predator: 0};
                    if (this.bifurcationParam === 'alpha') {
                        res = this.currentModel.calculateModel(x, y);
                    } else if (this.bifurcationParam === 'beta') {
                        res = this.currentModel.calculateModel(x, y);
                        // res = BasicLotkaVolterra.calculateModel(x, 0, this.alpha, this.gamma1, i, this.gamma2);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, i, 0.6, 0.56);
                    } else if (this.bifurcationParam === 'gamma1') {
                        res = this.currentModel.calculateModel(x, y);
                        // res = BasicLotkaVolterra.calculateModel(x, 0, this.alpha, i, this.beta, this.gamma2);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, i, 0.56);
                    } else if (this.bifurcationParam === 'gamma2') {
                        res = this.currentModel.calculateModel(x, y);
                        // res = BasicLotkaVolterra.calculateModel(x, 0, this.alpha, this.gamma1, this.beta, i);
                        // res = lotkaVolterraContiniousTime(x, y, 1.6, 125, 3.2, 50, 0.6, i);
                    }
                    x = x + res.prey;
                    this.dataBifurcation.push([i, x])
                }
                this.seriesBifurcation = [{
                    name: "Bifrucation " + this.bifurcationParam,
                    data: this.dataBifurcation
                }];
                this.$emit('bifurcation', this.seriesBifurcation)
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
            },
            compare() {
                this.compareDataPrey = Array.from(this.dataPrey);
                this.compareDataPredator = Array.from(this.dataPredator);
                this.seriesCompare = [
                    {
                        name: "Prey population",
                        data: this.compareDataPrey
                    },
                    {
                        name: "Predator population",
                        data: this.compareDataPredator
                    }
                ];
                var curParams = null;
                if (this.isLotkaVolterra === true || this.isLotkaVolterraQuadratic) {
                    curParams = this.experimentLotkaVolterra;
                } else if (this.isLotkaVolterraFiniteCapacity === true) {
                    curParams = this.experimentLotkaVolterraFiniteCapacity;
                } else if (this.isLotkaVolterraContTime === true) {
                    curParams = this.experimentLotkaVolterraContTime;
                } else if (this.isRosenzweigMacArthur === true) {
                    curParams = this.experimentRosenzweigMacArthur;
                }
                this.$emit('compare', {series: this.seriesCompare, params: curParams});
            },
            savePdf() {
                this.$emit('savePdf', true)
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