<template>
    <div style="margin-top: 20px">
        <b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-width">Grid width</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001" id="input-width"
                                  v-model.number="simulationParams.width"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-height">Grid height</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001" id="input-height"
                                  v-model.number="simulationParams.height"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-prey">Prey probability</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001" id="input-prey"
                                  v-model.number="simulationParams.isAliveProbability"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-predator">Predator probability</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001" id="input-predator"
                                  v-model.number="simulationParams.isPredatorProbability"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-preyLifespan">prey Lifespan</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001" id="input-preyLifespan"
                                  v-model.number="simulationParams.preyLifespan"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-preyAdulthoodAge">prey Adulthood Age</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001"
                                  id="input-preyAdulthoodAge"
                                  v-model.number="simulationParams.preyAdulthoodAge"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-preyBirthPeriod">prey Birth Period</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001"
                                  id="input-preyBirthPeriod"
                                  v-model.number="simulationParams.preyBirthPeriod"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-predatorLifespan">predator Lifespan</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001"
                                  id="input-predatorLifespan"
                                  v-model.number="simulationParams.predatorLifespan"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-predatorAdulthoodAge">predator Adulthood Age</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001"
                                  id="input-predatorAdulthoodAge"
                                  v-model.number="simulationParams.predatorAdulthoodAge"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-predatorBirthPeriod">predator Birth Period</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001"
                                  id="input-predatorBirthPeriod"
                                  v-model.number="simulationParams.predatorBirthPeriod"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-predatorFeedPreyCount">predator Feed Prey Count</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001"
                                  id="input-predatorFeedPreyCount"
                                  v-model.number="simulationParams.predatorFeedPreyCount"/>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="6">
                    <label for="input-hungerSteps">hunger Steps</label>
                </b-col>
                <b-col sm="6">
                    <b-form-input max="1000.00" min="0.00" step="0.001" id="input-hungerSteps"
                                  v-model.number="simulationParams.hungerSteps"/>
                </b-col>
            </b-row>
        </b-row>
        <b-row>
            <b-col>
                <div>
                    <b-row>
                        <b-button
                                class="button"
                                v-on:click="send('slowDown')"
                                variant="outline-primary"
                        >
                            Slow down
                        </b-button>
                        <b-button
                                class="button"
                                v-on:click="send('play')"
                                variant="outline-primary"
                        >
                            <div v-if="isRunning">Stop</div>
                            <div v-if="!isRunning">Play</div>
                        </b-button>
                        <b-button
                                class="button"
                                v-on:click="send('redoSession')"
                                variant="outline-primary"
                        >
                            Clear grid
                        </b-button>
                        <b-button
                                class="button"
                                v-on:click="send('nextStep')"
                                variant="outline-primary"
                        >
                            Next step
                        </b-button>
                        <b-button
                                class="button"
                                v-on:click="send('speedUp')"
                                variant="outline-primary"
                        >
                            Speed up
                        </b-button>
                        <b-button
                                class="button"
                                v-on:click="send('randomSeed')"
                                variant="outline-primary"
                        >
                            Random seed
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
                    preyAdulthoodAge: 6,
                    preyBirthPeriod: 2,

                    predatorLifespan: 100,
                    predatorAdulthoodAge: 5,
                    predatorBirthPeriod: 1,
                    predatorFeedPreyCount: 2,

                    hungerSteps: 8,
                    ///////////////////////////////////////////////////////////////////////////
                    isAliveProbability: 0.4,
                    isPredatorProbability: 0.1,

                    ////////////////////////////////////////////////////////////////////////////
                    width: 40,
                    height: 20,
                }
            };
        },
        methods: {
            send: function (event) {
                this.$emit('send', event);
                this.$emit('params', this.simulationParams);
            },
        },
    };
</script>

<style scoped>
    .button {
        margin-right: 10px;
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

