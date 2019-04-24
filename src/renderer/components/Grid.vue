<template>
    <div>
        <app-stats
                :cell-count="cellCount"
                :cells-alive="cellsAlive"
                :cells-created="cellsCreated"
                :current-speed="currentSpeed"
                :current-tick="currentTick"/>
        <div
                @mousedown="isMouseDown = true"
                @mouseleave="isMouseDown = false"
                @mouseup="isMouseDown = false"
                class="grid columns">
            <div
                    :key="indexX"
                    class="column"
                    v-for="(col, indexX) in gridList">
                <app-cell
                        :is-mouse-down="isMouseDown"
                        :key="indexY"
                        :status-obj="isAlive"
                        :x-pos="indexX"
                        :y-pos="indexY"
                        @wasUpdated="updateCellCount"
                        v-for="(isAlive, indexY) in col"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Cell from './Cell.vue';
    import Stats from './Stats.vue';

    export default {
        components: {
            'app-cell': Cell,
            'app-stats': Stats,
        },
        props: {
            message: {
                default: '',
                type: String,
            },
            importToken: {
                default: '',
                type: String,
            },
            currentSpeed: {
                default: 0,
                type: Number,
            },
        },
        data() {
            return {
                width: 46,
                height: 20,
                gridList: [],

                // Stats that get passed down to the app-stats component
                currentTick: 0,
                cellCount: 0,
                cellsAlive: 0,
                cellsCreated: 0,

                // A prop that gets used by the app-cell component (drag)
                isMouseDown: false,
            };
        },
        computed: {},
        watch: {
            /**
             * Watches for changes in the message prop
             * that gets passed down from the App component
             * and then handles the input on a specific tick.
             *
             * @param {string} val - the value
             */
            message: function (val) {
                if (val === 'nextStep') {
                    this.update();
                    this.currentTick++;
                } else if (val === 'redoSession') {
                    this.reset();
                } else if (val === 'randomSeed') {
                    this.randomSeed();
                } else if (val === 'importSession') {
                    this.importSession();
                } else if (val === 'exportSession') {
                    this.exportSession();
                }
            },
        },
        created() {
            this.cellCalc();
        },
        methods: {
            /**
             * Creates a 2D-Array during runtime for
             * the website to use for most operations.
             */
            cellCalc: function () {
                for (let i = 0; i < this.width; i++) {
                    this.gridList[i] = [];
                    for (let j = 0; j < this.height; j++) {
                        this.gridList[i][j] = {isAlive: false};
                    }
                }
                this.cellCount = this.width * this.height;
            },
            /**
             * Changes the 'isAlive' object property
             * of a specific cell to the one requested
             * in the param.
             *
             * @param {number} x - the x position
             * @param {number} y - the y position
             * @param {boolean} isAlive - the new boolean
             * @param isPredator
             */
            setCell: function (x, y, isAlive, isPredator) {
                if (this.gridList[x][y].isAlive !== isAlive) {
                    this.gridList[x][y].isAlive = isAlive;
                    this.gridList[x][y].isPredator = isPredator;
                    this.updateCellCount(isAlive);
                }
            },
            /**
             * The main function that updates the grid
             * every tick based on the game of life rules.
             */
            update: function () {
                let tempArr = [];
                for (let i = 0; i < this.width; i++) {
                    tempArr[i] = [];
                    for (let j = 0; j < this.height; j++) {
                        let isAliveStatus = this.gridList[i][j].isAlive;
                        let isPredatorStatus = this.gridList[i][j].isPredator;

                        let neighbours = this.getNeighbours(i, j);
                        let neighboursCount = neighbours.count;
                        let preyCount = neighbours.count - neighbours.countPredator;

                        let isAliveResult = false;
                        let isPredatorResult = isPredatorStatus;

                        /*  if (isAliveStatus) {
                              if (isPredatorStatus) {
                                  if (neighbours.countPredator < 2) {
                                      isAliveResult = true;
                                      isPredatorStatus = true;
                                  }
                              } else {
                                  if (preyCount === 1 && neighbours.countPredator === 0) {
                                      isAliveResult = true;
                                  }
                              }
                          }*/
                        // Rule 1:
                        // Any live cell with fewer than two live neighbours dies,
                        // as if by under population
                        if (isAliveStatus && neighboursCount < 2) {
                            isAliveResult = false;
                        }
                        // Rule 2:
                        // Any live cell with two or three neighbours lives on
                        // to the next generation
                        if ((isAliveStatus && neighboursCount === 2) || neighboursCount === 3) {
                            isAliveResult = true;
                            if (isPredatorStatus !== true && neighbours.countPredator > 0) {
                                isAliveResult = false;
                            }
                        }
                        // Rule 3:
                        // Any live cell with more than three live neighbours dies,
                        // as if by overpopulation
                        if (isAliveStatus && neighboursCount > 3) {
                            isAliveResult = false;
                        }
                        // Rule 4:
                        // Any dead cell with exactly three live neighbours becomes
                        // a live cell, as if by reproduction
                        if (!isAliveStatus && neighboursCount == 3) {
                            isPredatorResult = preyCount < neighbours.countPredator;
                            isAliveResult = true;
                        }
                        // if (!isAliveStatus && neighboursCount == 2) {
                        if (!isAliveStatus && neighboursCount == 2) {
                            if (preyCount == 2) {
                                isAliveResult = true;
                            }
                        }
                        tempArr[i][j] = {
                            isAlive: isAliveResult,
                            isPredator: isPredatorResult
                        };
                    }
                }
                // set new gridList content
                for (let i = 0; i < this.width; i++) {
                    for (let j = 0; j < this.height; j++) {
                        this.setCell(i, j, tempArr[i][j].isAlive, tempArr[i][j].isPredator);
                    }
                }
            },
            /**
             * Returns the amount of neighbours for
             * a specific cell on the grid.
             *
             * @param {number} posX - the x position
             * @param {number} posY - the Y position
             * @return {Object} neighbours - amount of neighbours
             */
            getNeighbours: function (posX, posY) {
                let neighbours = {
                    count: 0,
                    countPredator: 0
                };
                if (posX <= this.width && posY <= this.height) {
                    for (let offsetX = -1; offsetX < 2; offsetX++) {
                        for (let offsetY = -1; offsetY < 2; offsetY++) {
                            let newX = posX + offsetX;
                            let newY = posY + offsetY;
                            // check if offset is:
                            // on current cell, out of bounds and if isAlive
                            // for cell true
                            if ((offsetX !== 0 || offsetY !== 0)
                                && newX >= 0 && newX < this.width
                                && newY >= 0 && newY < this.height
                                && this.gridList[newX][newY].isAlive === true
                            ) {
                                neighbours.count++;
                                if (this.gridList[newX][newY].isPredator === true) {
                                    neighbours.countPredator++;
                                }
                            }
                        }
                    }
                }
                return neighbours;
            },
            /**
             * Resets all gridList cells back to the
             * start value.
             */
            reset: function () {
                this.currentTick = 0;
                this.cellsAlive = 0;
                this.cellsCreated = 0;
                this.gridList.forEach((col) => {
                    col.forEach((cell) => {
                        cell.isAlive = false;
                    });
                });
            },
            /**
             * Populates and overwrites gridList with cells.
             */
            randomSeed: function () {
                for (let i = 0; i < this.width; i++) {
                    for (let j = 0; j < this.height; j++) {
                        let rnd = Math.random();
                        let isAlive = rnd < 0.4;
                        let isPredator = rnd < 0.13;
                        this.setCell(i, j, isAlive, isPredator);
                    }
                }
            },
            /**
             * Resets and then imports new cells into the gridList
             * based on the importToken prop that gets passed down
             * App.vue.
             * The importToken is a string and its syntax looks
             * like this:
             * '[xPos,yPos],[xPos,yPos]...'.
             */
            importSession: function () {
                this.reset();
                let regex = /\[\d+,\d+\]/gm;
                let tempArr = this.importToken.match(regex);
                if (tempArr) {
                    tempArr.forEach((element) => {
                        element = element.substring(1, element.length - 1);
                        let xy = element.split(',');
                        this.setCell(xy[0], xy[1], true, Math.random() < 0.1);
                    });
                }
            },
            /**
             * Uses gridList to create an exportToken and
             * emits it up to App.vue for the user to copy.
             * Same format as in importToken().
             */
            exportSession: function () {
                let exportToken = '';
                for (let i = 0; i < this.width; i++) {
                    for (let j = 0; j < this.height; j++) {
                        if (this.gridList[i][j].isAlive) {
                            exportToken += '[' + i + ',' + j + ']';
                        }
                    }
                }
                this.$emit('exportToken', exportToken);
            },
            /**
             * Updates the current cellcount on each new tick.
             *
             * @param {boolean} bool - boolean based on cell isAlive status
             */
            updateCellCount: function (bool) {
                if (bool) {
                    this.cellsAlive++;
                    this.cellsCreated++;
                } else {
                    this.cellsAlive--;
                }
            },
        },
    };
</script>

<style lang="scss">
    .grid {
        border-top: 1px solid #1a0707;
        border-left: 1px solid #1a0707;
        display: flex;
        flex: 1;
        justify-content: center;
    }

    .column {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 0;
        margin: 0 auto;
        flex-direction: column;
    }
</style>
