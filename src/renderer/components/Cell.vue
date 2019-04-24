<template>
    <div
            :class="getCellStatusClass()"
            @click="reborn(true)"
            @mouseover="reborn(isMouseDown)"
            class="cell"></div>
</template>
<script>
    export default {
        props: {
            statusObj: {
                default: function () {
                    return {
                        isAlive: false,
                        isPredator: false
                    };
                },
                type: Object,
            },
            xPos: {
                default: -1,
                type: Number,
            },
            yPos: {
                default: -1,
                type: Number,
            },
            isPredator: {
                default: false,
                type: Boolean,
                required: false
            },
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
            /**
             * Checks if the cell has been clicked
             * and switches its isAlive status.
             * Also emits to the grid component for the
             * drag and drop functionality.
             *
             * @param {boolean} bool - the isMouseDown boolean
             */
            reborn: function (bool) {
                if (bool) {
                    this.status.isAlive = !this.status.isAlive;
                    this.$emit('wasUpdated', this.status.isAlive);
                }
            },
            getCellStatusClass() {
                if (this.status.isAlive && this.status.isPredator) {
                    return 'predator'
                } else if (this.status.isAlive && !this.status.isPredator) {
                    return 'prey'
                } else {
                    return 'dead'
                }
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

    .dead {
        background-color: white !important;
    }
</style>
