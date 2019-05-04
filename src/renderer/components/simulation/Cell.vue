<template>
    <div
            :class="getCellStatusClass()"
            @click="reborn(true)"
            @mouseover="reborn(isMouseDown)"
            class="cell"></div>
</template>
<script>
    import {Organism} from "../../assets/simulation/Organism";
    import {Predator} from "../../assets/simulation/Predator";
    import {Prey} from "../../assets/simulation/Prey";
    import {Person} from "../../assets/simulation/Person";

    export default {
        props: {
            organism: {
                type: Organism,
                default: null
            },
            statusObj: {
                default: function () {
                    return {
                        isAlive: false,
                        isPredator: false
                    };
                },
                type: Object,
            },
            // xPos: {
            //     default: -1,
            //     type: Number,
            // },
            // yPos: {
            //     default: -1,
            //     type: Number,
            // },
            // isPredator: {
            //     default: false,
            //     type: Boolean,
            //     required: false
            // },
            isMouseDown: {
                default: false,
                type: Boolean,
            },
        },
        data() {
            return {
                status: this.statusObj,
            };
        },
        methods: {
            reborn: function (bool) {
                if (bool) {
                    this.status.isAlive = !this.status.isAlive;
                    this.$emit('wasUpdated', this.status.isAlive);
                }
            },
            getCellStatusClass() {
                if (this.organism === null) {
                    return 'dead';
                }
                if (this.organism instanceof Predator) {
                    return 'predator';
                } else if (this.organism instanceof Prey) {
                    return 'prey';
                } else if (this.organism instanceof Person) {
                    return 'human';
                }
                // if (this.status.isAlive && this.status.isPredator) {
                //     return 'predator'
                // } else if (this.status.isAlive && !this.status.isPredator) {
                //     return 'prey'
                // } else {
                //     return 'dead'
                // }
            }
        },
    };
</script>

<style>
    .cell {
        flex: 1;
        border-right: 1px solid #1a0707;
        border-bottom: 1px solid #1a0707;
        padding-bottom: 100%;
    }

    .cell:hover {
        background-color: rgba(132, 26, 26, 0.6);
    }

    .alive {
        background-color: #bb4747 !important;
    }

    .predator {
        background-color: #c729ee !important;
    }

    .prey {
        background-color: #38eea4 !important;
    }

    .human {
        background-color: #eec72c !important;
    }

    .dead {
        background-color: white !important;
    }
</style>
