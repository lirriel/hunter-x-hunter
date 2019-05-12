<template>
    <div>
        <b-row>
            <b-col sm="4">
                <b-row v-for="obj in Object.keys(eqScope)">
                    <b-col sm="3">
                        <v-label>{{obj}}</v-label>
                    </b-col>
                    <b-col>
                        <vs-input v-model.number="eqScope[obj].toFixed(2)"/>
                    </b-col>
                </b-row>
                <b-button v-if="!isAdd" v-on:click="addValue" variant="outline-info">
                    <i class="fas fa-plus"></i>
                </b-button>
                <vs-input label="Key" v-if="isAdd" v-model="key"/>
                <vs-input label="Value" v-if="isAdd" v-model.number="value"/>
                <b-button v-if="isAdd" v-on:click="save">Save</b-button>
                <vs-divider/>
                <b-form-checkbox v-model="isDifferential">
                    Is differential equation
                </b-form-checkbox>
                <div v-if="isDifferential">
                    <b-form-select :options="Object.keys(eqScope)" v-model="difParam"/>
                    <b-row>
                        <b-col>
                            <label style="margin-top: 30px">
                                d {{difParam}} / d {{changeParam}}</label>
                        </b-col>
                        <b-col>
                            <vs-input label="Equation" style="width: 370px;" v-model="equation"/>
                        </b-col>
                    </b-row>
                </div>
                <div v-else>
                    <vs-input label="Equation" placeholder="0" v-model="equation"/>
                    <b-button style="margin-top: 10px"
                              v-on:click="doEquation"
                              variant="outline-info">
                        Calculate
                    </b-button>
                    <br><br>
                    <label>Result = {{result}}</label>
                </div>
            </b-col>
            <b-col sm="8">
                <b-row>
                    <b-col>
                        <b-form-select :options="Object.keys(eqScope)" style="margin-top: 30px;"
                                       title="Select changeable parameter"
                                       v-b-tooltip.hover v-model="changeParam"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Min" v-model.number="min"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Max" v-model.number="max"/>
                    </b-col>
                    <b-col>
                        <vs-input label="Step" v-model.number="step"/>
                    </b-col>
                    <b-col>
                        <b-button style="margin-top: 30px;"
                                  v-on:click="fori"
                                  variant="outline-primary">
                            <i class="fas fa-play"></i>
                        </b-button>
                    </b-col>
                </b-row>
                <b-row>
                    <basic-chart-box :chart-options="chartOptions"
                                     :series="series" style="width: 800px"></basic-chart-box>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import * as math from 'mathjs'
    import BasicChartBox from './diagrams/BasicChartBox'
    import {simpleChartOptions} from "../assets/simulation/predatorPreyChartOptions";

    export default {
        name: "CalculateCustomParameters",
        props: {
            inputModel: {
                type: Object,
                default: () => {
                    return {
                        a: 10,
                        b: 12
                    }
                }
            },
            inputEquation: {
                type: String,
                default: '2*a-12*b'
            }
        },
        components: {BasicChartBox},
        data() {
            return {
                equation: '',
                result: '',
                eqScope: this.inputModel,
                isAdd: false,
                key: '',
                value: '',
                min: 0,
                max: 1,
                step: 0.1,
                difParam: 'a',
                changeParam: 'b',
                series: [],
                chartOptions: simpleChartOptions,
                isDifferential: false
            }
        },
        watch: {
            inputModel: function (d) {
                console.log(d);
                console.log(Object.getPrototypeOf(d));
                this.eqScope = Object.assign({}, d);
            }
        },
        methods: {
            doEquation() {
                this.result = math.eval(this.equation, this.eqScope)
            },
            addValue() {
                this.isAdd = true;
                this.key = '';
                this.value = ''
            },
            save() {
                this.eqScope[this.key] = this.value;
                console.log(this.eqScope);
                this.isAdd = false;
            },
            fori() {
                this.chartOptions.yaxis = [];
                let res = [];
                let copyEq = Object.assign({}, this.eqScope);
                for (let i = this.min; i <= this.max; i += this.step) {
                    copyEq[this.changeParam] = i;
                    if (this.isDifferential === false) {
                        res.push([i, math.eval(this.equation, copyEq)])
                    } else {
                        let t = math.eval(this.equation, copyEq);
                        copyEq[this.difParam] += t;
                        res.push([i, copyEq[this.difParam]])
                    }
                }
                this.series = [
                    {
                        name: "Calculated",
                        data: res
                    }
                ]
            }
        }
    }
</script>

<style scoped>

    .row, .col {
        margin-bottom: 10px;
        margin-right: 5px;
    }

    .vs-input {
        margin-right: 5px;
    }

</style>