<template>
    <div style="margin-top: 20px">
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
            return {};
        },
        methods: {
            send: function (event) {
                this.$emit('send', event);
            },
        },
    };
</script>

<style scoped>
    .button {
        margin-right: 10px;
    }
</style>

