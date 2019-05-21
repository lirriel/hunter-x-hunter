import {Organism, randomInteger, removeOrganism, steps, turnStep} from "./Organism";
import {Predator} from "./Predator";
import {Prey} from "./Prey";
import * as math from "mathjs";

var killRangeOrganisms = [];
var huntRangeOrganisms = [];

export class Person extends Organism {

    constructor(lifespan,
                x, y,
                killPredatorPriority,
                killPreyPriority,
                killRange,
                noticeOrganismRange,
    ) {
        super(lifespan, 0, 0, x, y);
        this.age = 0;
        this.killPredatorPriority = killPredatorPriority;
        this.killPreyPriority = killPreyPriority;
        this.killRange = killRange;
        this.noticeOrganismRange = noticeOrganismRange;
        this.hungerStepsCounter = Person.hungerSteps;
    }

    static setPreyNeedLimit(value) {
        Person.preyNeedLimit = value;
    }

    static setHungerSteps(value) {
        Person.hungerSteps = value;
    }

    static setPreyNeedStepsLimit(value) {
        Person.preyNeedStepsLimit = value;
    }

    calculateInstinct(organisms, huntedPrey, maxX, maxY) {
        let surrounding = this.checkCoordinates(organisms, maxX, maxY);
        let huntedDistance = Array(8).fill(Number.MAX_SAFE_INTEGER);
        for (let i = 0; i < 8; i++) {
            if (surrounding[i] === true) {
                let huntTurnStep = turnStep(i, this.x, this.y);
                huntedDistance[i] = huntedPrey.calculateDistance(huntTurnStep.x, huntTurnStep.y);
            }
        }
        let minDist = maxX * maxY;
        let moveNumber = -1;
        for (let it = 0; it < 8; it++) {
            if ((surrounding[it] === true) && (huntedDistance[it] < minDist)) {
                minDist = huntedDistance[it];
                moveNumber = it;
            }
        }
        let turnPosition = turnStep(moveNumber, this.x, this.y);
        organisms[this.x][this.y] = null;
        organisms[turnPosition.x][turnPosition.y] = this;
        this.setPosition(turnPosition.x, turnPosition.y);
    }

    moveHunter(organisms, maxX, maxY) {
        this.tickAge();
        if (this.age > this.lifespan) {
            removeOrganism(organisms, this);
            // organisms = organisms.splice(organisms.indexOf(this), 1);
            return;
        }
        let minPredatorDist = Number.MAX_SAFE_INTEGER;
        let closestPredator = null;

        let minPreyDist = Number.MAX_SAFE_INTEGER;
        let closestPrey = null;
        killRangeOrganisms = [];
        huntRangeOrganisms = [];

        var direction = 0;
        let init = [this.x + steps[direction][0], this.y + steps[direction][1]];
        let currentDist = this.calculateDistance(init[0], init[1]);
        let stepInd = 1;
        while (currentDist <= this.noticeOrganismRange && (closestPrey == null || closestPredator == null)) {
            if (init[0] >= 0 && init[1] >= 0 && init[0] <= maxX && init[1] <= maxY) {
                let o = organisms[init[0]][init[1]];
                if (o && o instanceof Prey) {
                    closestPrey = o;
                    minPreyDist = this.calculateDistanceWith(o);
                } else if (o && o instanceof  Predator) {
                    closestPredator = o;
                    minPredatorDist = this.calculateDistanceWith(o);
                }
            }
            stepInd++;
            direction = (direction + 1) % 8;
            let ar = math.multiply(steps[direction], stepInd);
            init = [this.x + ar[0], this.y + ar[1]];
            currentDist = this.calculateDistance(init[0], init[1]);
        }
        if (closestPrey == null && closestPredator == null) {
            this.move(organisms, maxX, maxY);
            return;
        }
        if (minPredatorDist * this.killPreyPriority > minPredatorDist * this.killPredatorPriority) {
            this.hunt(organisms, closestPrey, minPreyDist, maxX, maxY)
        } else {
            this.hunt(organisms, closestPredator, minPredatorDist, maxX, maxY)
        }
    }

    hunt(organisms, o, dist, x, y) {
        if (dist <= this.killRange) {
            if (o instanceof Prey) {
                if (Person.preyNeedCounter === Person.preyNeedLimit) {
                    if (Person.preyNeedStepsLimit === Person.preyNeedStepsCounter) {
                        Person.preyNeedCounter = 0;
                        Person.preyNeedStepsLimit = 0;
                        removeOrganism(organisms, o)
                    } else {
                        Person.preyNeedStepsLimit++;
                        this.move(organisms, x, y);
                    }
                } else {
                    removeOrganism(organisms, o);
                    Person.preyNeedCounter++;
                }
            } else {
                removeOrganism(organisms, o)
            }
        } else if (dist <= this.noticeOrganismRange) {
            this.calculateInstinct(organisms, o, x, y)
        }
    }
}

Person.preyNeedLimit = 10;
Person.preyNeedCounter = 0;

Person.preyNeedStepsLimit = 12;
Person.preyNeedStepsCounter = 0;

Person.hungerSteps = 4;
