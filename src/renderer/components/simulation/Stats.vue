<template>
    <div>
        <b-row>
            <b-col>
                <label>TICK: {{tick}}</label>
            </b-col>
            <b-col>
                <label>PREY COUNT: {{prey}}</label>
            </b-col>
            <b-col>
                <label>PREDATOR COUNT: {{predator}}</label>
            </b-col>
            <b-col>
                <label>CELLS: {{cells}}</label>
            </b-col>
            <b-col>
                <label>SPEED: {{speed}}</label>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        props: {
            tick: {
                default: 0,
                type: Number,
            },
            prey: {
                default: 0,
                type: Number,
            },
            predator: {
                default: 0,
                type: Number,
            },
            cells: {
                default: 0,
                type: Number,
            },
            speed: {
                default: 0,
                type: Number,
            },
        },
        data() {
            return {};
        },
    };
</script>

<style scoped>
    label {
        color: black;
    }
</style>
