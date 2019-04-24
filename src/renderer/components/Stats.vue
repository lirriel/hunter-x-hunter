<template>
    <div>
        <b-row>
            <b-col sm="2">
                <label>TICK: {{currentTick}}</label>
            </b-col>
            <b-col sm="2">
                <label>CELL COUNT: {{cellCount}}</label>
            </b-col>
            <b-col sm="2">
                <label>CELLS ALIVE: {{cellsAlive}}</label>
            </b-col>
            <b-col sm="2">
                <label>CELLS CREATED: {{cellsCreated}}</label>
            </b-col>
            <b-col sm="2">
                <label>SPEED: {{currentSpeed}}</label>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        props: {
            currentTick: {
                default: 0,
                type: Number,
            },
            cellCount: {
                default: 0,
                type: Number,
            },
            cellsAlive: {
                default: 0,
                type: Number,
            },
            cellsCreated: {
                default: 0,
                type: Number,
            },
            currentSpeed: {
                default: 0,
                type: Number,
            },
        },
        data() {
            return {};
        },
        methods: {},
    };
</script>

<style scoped>
    label {
        color: black;
    }
</style>
