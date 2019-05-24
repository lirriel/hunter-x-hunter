<template>
    <div style="margin-top: 20px">
        <b-row>
            <b-tabs style="color: black" v-if="simulationParams">
                <b-tab title="System parameters">
                    <div style="padding-top: 10px">
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-width">Grid width</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.width, 2, 100)"
                                              aria-describedby="input-msg-1" id="input-width"
                                              max="1000.00" min="0.00" step="0.001"
                                              v-model.number="simulationParams.width"/>
                                <b-form-invalid-feedback id="input-msg-1">
                                    {{areaMsg(2, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-height">Grid height</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.height, 2, 100)"
                                              aria-describedby="input-msg-2" id="input-height"
                                              max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.height"/>
                                <b-form-invalid-feedback id="input-msg-2">
                                    {{areaMsg(2, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-prey">Prey probability</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :min="simulationParams.isPredatorProbability"
                                              :state="checkRange(simulationParams.isAliveProbability, 0, 1)"
                                              aria-describedby="input-msg-3"
                                              id="input-prey"
                                              max="1.00"
                                              step="0.001"
                                              v-model.number="simulationParams.isAliveProbability"/>
                                <b-form-invalid-feedback id="input-msg-3">
                                    {{areaMsg(0, 1)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predator">Predator probability</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :min="simulationParams.isHumanProbability"
                                              :state="checkRange(simulationParams.isPredatorProbability, 0, simulationParams.isAliveProbability)"
                                              aria-describedby="input-msg-4"
                                              id="input-predator"
                                              max="1000.00"
                                              step="0.001"
                                              v-model.number="simulationParams.isPredatorProbability"/>
                                <b-form-invalid-feedback id="input-msg-4">
                                    {{areaMsg(0, simulationParams.isAliveProbability)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>


                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-human-check">Add human role</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-checkbox id="input-human-check"
                                                 name="check-button"
                                                 switch v-model="simulationParams.isHumanRequired"/>
                            </b-col>
                        </b-row>

                        <b-row class="my-1" v-if="simulationParams.isHumanRequired">
                            <b-col sm="6">
                                <label for="input-human">Human probability</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.isHumanProbability, 0, simulationParams.isPredatorProbability)"
                                              aria-describedby="input-msg-5" id="input-human"
                                              max="1000.00" min="0.00" step="0.001"
                                              v-model.number="simulationParams.isHumanProbability"/>
                                <b-form-invalid-feedback id="input-msg-5">
                                    {{areaMsg(0, simulationParams.isPredatorProbability)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyLifespan">Prey Lifespan</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.preyLifespan, 1, 200)"
                                              aria-describedby="input-msg-6" id="input-preyLifespan"
                                              max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyLifespan"/>
                                <b-form-invalid-feedback id="input-msg-6">
                                    {{areaMsg(1, 200)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyAdulthoodAge">Prey Adulthood Age</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.preyAdulthoodAge, 1, 200)"
                                              aria-describedby="input-msg-7"
                                              id="input-preyAdulthoodAge" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyAdulthoodAge"/>
                                <b-form-invalid-feedback id="input-msg-7">
                                    {{areaMsg(1, 200)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyBirthPeriod">Prey Birth Period</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.preyBirthPeriod, 1, simulationParams.preyLifespan)"
                                              aria-describedby="input-msg-8"
                                              id="input-preyBirthPeriod" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyBirthPeriod"/>
                                <b-form-invalid-feedback id="input-msg-8">
                                    {{areaMsg(1, simulationParams.preyLifespan)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorLifespan">Predator Lifespan</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.predatorLifespan, 0, 200)"
                                              aria-describedby="input-msg-9"
                                              id="input-predatorLifespan" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorLifespan"/>
                                <b-form-invalid-feedback id="input-msg-9">
                                    {{areaMsg(0, 200)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorAdulthoodAge">Predator Adulthood
                                    Age</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.predatorAdulthoodAge, 1, 200)"
                                              aria-describedby="input-msg-10"
                                              id="input-predatorAdulthoodAge" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorAdulthoodAge"/>
                                <b-form-invalid-feedback id="input-msg-10">
                                    {{areaMsg(0, 200)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorBirthPeriod">Predator Birth Period</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.predatorBirthPeriod, 1, simulationParams.predatorLifespan)"
                                              aria-describedby="input-msg-11"
                                              id="input-predatorBirthPeriod" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorBirthPeriod"/>
                                <b-form-invalid-feedback id="input-msg-11">
                                    {{areaMsg(1, simulationParams.predatorLifespan)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorFeedPreyCount">Predator Feed Prey
                                    Count</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.predatorFeedPreyCount, 0, 100)"
                                              aria-describedby="input-msg-12"
                                              id="input-predatorFeedPreyCount" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorFeedPreyCount"/>
                                <b-form-invalid-feedback id="input-msg-12">
                                    {{areaMsg(0, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-hungerSteps">Predator Hunger Steps</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.hungerSteps, 0, 100)"
                                              aria-describedby="input-msg-13" id="input-hungerSteps"
                                              max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.hungerSteps"/>
                                <b-form-invalid-feedback id="input-msg-13">
                                    {{areaMsg(0, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                    </div>
                </b-tab>
                <b-tab title="Human parameters">
                    <div style="padding-top: 10px">
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-killPredatorPriority">Kill Predator
                                    Priority</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.killPredatorPriority, 0, 1)"
                                              aria-describedby="input-msg-14"
                                              id="input-killPredatorPriority" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.killPredatorPriority"/>
                                <b-form-invalid-feedback id="input-msg-14">
                                    {{areaMsg(0, 1)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>


                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-killPreyPriority">Kill Prey Priority</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.killPreyPriority, 0, 1)"
                                              aria-describedby="input-msg-15"
                                              id="input-killPreyPriority" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.killPreyPriority"/>
                                <b-form-invalid-feedback id="input-msg-15">
                                    {{areaMsg(0, 1)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-killRange">Kill Range</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.killRange, 0, 100)"
                                              aria-describedby="input-msg-16" id="input-killRange"
                                              max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.killRange"/>
                                <b-form-invalid-feedback id="input-msg-16">
                                    {{areaMsg(0, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-noticeOrganismRange">Notice Animal Range</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.noticeOrganismRange, 0, 500)"
                                              aria-describedby="input-msg-17"
                                              id="input-noticeOrganismRange" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.noticeOrganismRange"/>
                                <b-form-invalid-feedback id="input-msg-17">
                                    {{areaMsg(0, 500)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyNeedLimit">Prey Need Limit</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.preyNeedLimit, 0, 100)"
                                              aria-describedby="input-msg-18"
                                              id="input-preyNeedLimit" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyNeedLimit"/>
                                <b-form-invalid-feedback id="input-msg-18">
                                    {{areaMsg(0, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyNeedStepsLimit">Prey Need Steps Limit</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input :state="checkRange(simulationParams.preyNeedStepsLimit, 0, 100)"
                                              aria-describedby="input-msg-19"
                                              id="input-preyNeedStepsLimit" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyNeedStepsLimit"/>
                                <b-form-invalid-feedback id="input-msg-19">
                                    {{areaMsg(0, 100)}}
                                </b-form-invalid-feedback>
                            </b-col>
                        </b-row>
                    </div>
                </b-tab>
            </b-tabs>
        </b-row>
        <vs-divider/>
        <b-col>
            <b-row>
                <b-button
                        class="button"
                        style="color:#883157;"
                        v-on:click="send('randomSeed')"
                        variant="outline-primary"
                >
                    <i class="fas fa-random"></i>
                    Random seed
                </b-button>
                <b-button
                        class="button"
                        style="color: #ff3044"
                        v-on:click="send('play')"
                        variant="outline-primary"
                >
                    <div v-if="isRunning"><i class="fas fa-stop"></i>Stop</div>
                    <div v-if="!isRunning">
                        <i class="fas fa-play"></i>
                        Play
                    </div>
                </b-button>
                <b-button
                        class="button"
                        style="color:#16624e;"
                        v-on:click="send('nextStep')"
                        variant="outline-primary"
                >
                    <i class="fas fa-forward"></i>
                    Next step
                </b-button>
            </b-row>
            <b-row>
                <b-button
                        class="button"
                        v-on:click="send('slowDown')"
                        variant="outline-primary"
                >
                    <i class="fas fa-level-down-alt"></i>
                    Slow down
                </b-button>
                <b-button
                        class="button"
                        v-on:click="send('speedUp')"
                        variant="outline-primary"
                >
                    <i class="fas fa-level-up-alt"></i>
                    Speed up
                </b-button>
                <b-button
                        class="button"
                        v-on:click="send('redoSession')"
                        variant="outline-primary"
                ><i class="far fa-trash-alt"></i>
                    Clear grid
                </b-button>
            </b-row>
            <b-row>
                <b-button
                        class="button"
                        style="color: darkolivegreen;"
                        v-on:click="send('saveData')"
                        variant="outline-primary"
                ><i class="fas fa-file-excel"></i>
                    Save xlsx file
                </b-button>
            </b-row>
        </b-col>
    </div>
</template>

<script>
    import {simulationParams} from "../../assets/simulation/simulationParams";
    import Fa from "vue-fa/src/fa";

    export default {
        components: {Fa},
        props: {
            isRunning: {
                default: false,
                type: Boolean,
            },
        },
        data() {
            return {
                simulationParams: simulationParams
            };
        },
        watch: {
            simulationParams: function () {
                this.updateParams();
            }
        },
        methods: {
            checkRange(value, min, max) {
                return value >= min && value <= max;
            },
            areaMsg(min, max) {
                return `Value should between ${min} and ${max}`
            },
            send: function (event) {
                this.$emit('send', event);
                this.updateParams();
            },
            updateParams() {
                this.$emit('params', this.simulationParams);
            }
        },
    };
</script>

<style scoped>
    .button {
        margin-right: 10px;
        margin-top: 10px;
        position: center;
    }

    label {
        width: 250px;
        font-size: medium;
        font-family: 'Karla', sans-serif;
    }

    .my-1 {
        width: 100%;
    }

    .form-control {
        height: 25px;
        width: 100px;
    }
</style>

