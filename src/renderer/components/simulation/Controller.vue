<template>
    <div style="margin-top: 20px">
        <b-row>
            <b-tabs style="color: black">
                <b-tab title="System parameters">
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
                            <b-form-input id="input-height" max="1000.00" min="0.00" step="0.001"
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
                            <b-form-input id="input-predator" max="1000.00" min="0.00" step="0.001"
                                          v-model.number="simulationParams.isPredatorProbability"/>
                        </b-col>
                    </b-row>


                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-human-check">Add human</label>
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
                            <label for="input-preyLifespan">prey Lifespan</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-preyLifespan" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.preyLifespan"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-preyAdulthoodAge">prey Adulthood Age</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-preyAdulthoodAge" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.preyAdulthoodAge"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-preyBirthPeriod">prey Birth Period</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-preyBirthPeriod" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.preyBirthPeriod"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-predatorLifespan">predator Lifespan</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-predatorLifespan" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.predatorLifespan"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-predatorAdulthoodAge">predator Adulthood Age</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-predatorAdulthoodAge" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.predatorAdulthoodAge"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-predatorBirthPeriod">predator Birth Period</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-predatorBirthPeriod" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.predatorBirthPeriod"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-predatorFeedPreyCount">predator Feed Prey
                                Count</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-predatorFeedPreyCount" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.predatorFeedPreyCount"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-hungerSteps">hunger Steps</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-hungerSteps" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.hungerSteps"/>
                        </b-col>
                    </b-row>
                </b-tab>
                <b-tab title="Human parameters">
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-killPredatorPriority">kill predator priority</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-killPredatorPriority" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.killPredatorPriority"/>
                        </b-col>
                    </b-row>


                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-killPreyPriority">kill Prey Priority</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-killPreyPriority" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.killPreyPriority"/>
                        </b-col>
                    </b-row>

                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-killRange">kill range</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-killRange" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.killRange"/>
                        </b-col>
                    </b-row>

                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-noticeOrganismRange">notice organism range</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-noticeOrganismRange" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.noticeOrganismRange"/>
                        </b-col>
                    </b-row>

                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-preyNeedLimit">prey need limit</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-preyNeedLimit" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.preyNeedLimit"/>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="6">
                            <label for="input-preyNeedStepsLimit">prey need steps limit</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input id="input-preyNeedStepsLimit" max="1000.00" min="0.00"
                                          step="0.001"
                                          v-model.number="simulationParams.preyNeedStepsLimit"/>
                        </b-col>
                    </b-row>
                </b-tab>
            </b-tabs>
        </b-row>
        <b-row>
            <b-col>
                <div>
                    <b-row style="margin-top: 10px;">
                        <b-button
                                class="button"
                                v-on:click="send('slowDown')"
                                variant="outline-primary"
                        >
                            Slow down
                        </b-button>
                        <br>
                        <b-button
                                class="button"
                                v-on:click="send('play')"
                                variant="outline-primary"
                        >
                            <div v-if="isRunning">Stop</div>
                            <div v-if="!isRunning">Play</div>
                        </b-button>
                        <br>
                        <b-button
                                class="button"
                                v-on:click="send('redoSession')"
                                variant="outline-primary"
                        >
                            Clear grid
                        </b-button>
                        <br>
                        <b-button
                                class="button"
                                v-on:click="send('nextStep')"
                                variant="outline-primary"
                        >
                            Next step
                        </b-button>
                        <br>
                        <b-button
                                class="button"
                                v-on:click="send('speedUp')"
                                variant="outline-primary"
                        >
                            Speed up
                        </b-button>
                        <br>
                        <b-button
                                class="button"
                                v-on:click="send('randomSeed')"
                                variant="outline-primary"
                        >
                            Random seed
                        </b-button>
                        <br>
                        <b-button
                                class="button"
                                v-on:click="send('saveData')"
                                variant="outline-warning"
                        >
                            Save xlsx
                        </b-button>
                    </b-row>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        props: {
            isRunning: {
                default: false,
                type: Boolean,
            },
        },
        data() {
            return {
                simulationParams: {
                    preyLifespan: 60,
                    preyAdulthoodAge: 3,
                    preyBirthPeriod: 2,

                    predatorLifespan: 100,
                    predatorAdulthoodAge: 5,
                    predatorBirthPeriod: 1,
                    predatorFeedPreyCount: 2,

                    hungerSteps: 8,
                    ///////////////////////////////////////////////////////////////////////////
                    isAliveProbability: 0.4,
                    isPredatorProbability: 0.2,
                    isHumanProbability: 0.02,
                    isHumanRequired: true,

                    killPredatorPriority: 0.2,
                    killPreyPriority: 0.1,
                    killRange: 12,
                    noticeOrganismRange: 20,
                    preyNeedLimit: 10,
                    preyNeedStepsLimit: 12,

                    ////////////////////////////////////////////////////////////////////////////
                    width: 40,
                    height: 20,
                }
            };
        },
        watch: {
            simulationParams: function (data) {
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
        margin-bottom: 5px;
    }

    label {
        font-size: smaller;
        font-family: "Bookman Old Style";
        margin-bottom: 0;
    }

    .my-1 {
        width: 100%;
    }

    .form-control {
        height: 25px;
        width: 100px;
    }
</style>

