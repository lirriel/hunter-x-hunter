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
                                <b-form-input id="input-width" max="1000.00" min="0.00" step="0.001"
                                              v-model.number="simulationParams.width"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-height">Grid height</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-height" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.height"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-prey">Prey probability</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-prey" max="1000.00" min="0.00" step="0.001"
                                              v-model.number="simulationParams.isAliveProbability"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predator">Predator probability</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-predator" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.isPredatorProbability"/>
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
                                <b-form-input id="input-human" max="1000.00" min="0.00" step="0.001"
                                              v-model.number="simulationParams.isHumanProbability"/>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyLifespan">Prey Lifespan</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-preyLifespan" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyLifespan"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyAdulthoodAge">Prey Adulthood Age</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-preyAdulthoodAge" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyAdulthoodAge"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyBirthPeriod">Prey Birth Period</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-preyBirthPeriod" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyBirthPeriod"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorLifespan">Predator Lifespan</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-predatorLifespan" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorLifespan"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorAdulthoodAge">Predator Adulthood
                                    Age</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-predatorAdulthoodAge" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorAdulthoodAge"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorBirthPeriod">Predator Birth Period</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-predatorBirthPeriod" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorBirthPeriod"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-predatorFeedPreyCount">Predator Feed Prey
                                    Count</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-predatorFeedPreyCount" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.predatorFeedPreyCount"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-hungerSteps">Predator Hunger Steps</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-hungerSteps" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.hungerSteps"/>
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
                                <b-form-input id="input-killPredatorPriority" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.killPredatorPriority"/>
                            </b-col>
                        </b-row>


                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-killPreyPriority">Kill Prey Priority</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-killPreyPriority" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.killPreyPriority"/>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-killRange">Kill Range</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-killRange" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.killRange"/>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-noticeOrganismRange">Notice Animal Range</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-noticeOrganismRange" max="1000.00"
                                              min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.noticeOrganismRange"/>
                            </b-col>
                        </b-row>

                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyNeedLimit">Prey Need Limit</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-preyNeedLimit" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyNeedLimit"/>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="6">
                                <label for="input-preyNeedStepsLimit">Prey Need Steps Limit</label>
                            </b-col>
                            <b-col sm="6">
                                <b-form-input id="input-preyNeedStepsLimit" max="1000.00" min="0.00"
                                              step="0.001"
                                              v-model.number="simulationParams.preyNeedStepsLimit"/>
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

