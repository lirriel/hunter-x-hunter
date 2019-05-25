import {Organism, randomInteger, removeOrganism, steps, turnStep} from "./Organism";
import {Prey} from "./Prey";
import * as math from 'mathjs';
import {Person} from "./Person";

export class Predator extends Organism {
    constructor(lifespan, adulthoodAge, birthPeriod, feedPreyCount, x, y) {
        super(lifespan, adulthoodAge, birthPeriod, x, y);
        this.hunger = Predator.hungerSteps;
        this.feedPreyCount = feedPreyCount;
        this.feedPreyTimer = 0;
    }

    static setHungerSteps(steps) {
        Predator.hungerSteps = steps;
    }

    calculateInstinct(organisms, huntedPrey, maxX, maxY) {
        let surrounding = this.checkCoordinates(organisms, maxX, maxY);
        let huntedDistance = Array(8).fill(Number.MAX_SAFE_INTEGER);
        console.log(JSON.stringify(huntedPrey))
        for (let i = 0; i < 8; i++) {
            if (surrounding[i] === true) {
                let huntTurnStep = turnStep(i, this.x, this.y);
                huntedDistance[i] = huntedPrey.calculateDistance(huntTurnStep.x, huntTurnStep.y);
            }
        }
        console.log(huntedDistance)
        let minDist = maxX * maxY;
        let moveNumber = -1;
        for (let it = 0; it < 8; it++) {
            if ((surrounding[it] === true) && (huntedDistance[it] < minDist)) {
                minDist = huntedDistance[it];
                moveNumber = it;
            }
        }
        let turnPosition = turnStep(moveNumber, this.x, this.y);
        console.log(turnPosition)
        if (turnPosition.x !== this.x || turnPosition.y !== this.y) {
            organisms[this.x][this.y] = null;
            organisms[turnPosition.x][turnPosition.y] = this;
            console.log("move to " + JSON.stringify(turnPosition));
            this.setPosition(turnPosition.x, turnPosition.y);
        }
    }

    movePredator(organisms, maxX, maxY) {
        this.tickAge();
        if (this.age > this.lifespan || this.hunger <= 0) {
            removeOrganism(organisms, this);
            return;
        }
        let currentPredator = this;
        let prey = null;
        let preyFlag = false;
        var direction = randomInteger(0, 7);
        let init = [this.x + steps[direction][0], this.y + steps[direction][1]];
        let currentDist = this.calculateDistance(init[0], init[1]);
        let stepInd = 1;
        while (currentDist <= Predator.range && preyFlag == false) {
            if (init[0] >= 0 && init[1] >= 0 && init[0] <= maxX && init[1] <= maxY) {
                let o = organisms[init[0]][init[1]];
                if (o && (o instanceof Prey || o instanceof Person)) {
                    if (currentDist <= Math.sqrt(2)) {
                        removeOrganism(organisms, o);
                        this.hunger = Predator.hungerSteps;
                        this.feedPreyTimer++;
                        if (this.feedPreyTimer >= this.feedPreyCount && this.birthPeriodTimer == 0) {
                            let surrounding = this.checkCoordinates(organisms, maxX, maxY);
                            let position = this.findFreeSpot(surrounding);
                            console.log("eat prey")

                            if (position.x !== this.x || position.y !== this.y) {
                                let newPredator = new Predator(randomInteger(80, 90),
                                    this.adulthoodAge, this.birthPeriod,
                                    this.feedPreyCount, position.x, position.y);
                                organisms[position.x][position.y] = newPredator;
                                currentPredator.feedPreyTimer %= this.feedPreyCount;
                                console.log("give birth")
                            }
                        }
                    } else {
                        prey = o;
                    }
                    preyFlag = true;
                    break;
                }
            }
            stepInd++;
            direction = (direction + 1) % 8;
            let ar = math.multiply(steps[direction], stepInd);
            init = [this.x + ar[0], this.y + ar[1]];
            currentDist = this.calculateDistance(init[0], init[1]);
        }
        console.log(this)
        console.log(prey)
        console.log(currentDist)
        console.log(Predator.range)
        if (prey !== null) {
            if (currentDist <= Predator.range) {
                this.calculateInstinct(organisms, prey, maxX, maxY);
            } else {
                this.move(organisms, maxX, maxY);
            }
            this.hunger--;
        } else if (preyFlag === false) {
            this.move(organisms, maxX, maxY);
            this.hunger--;
        }
    }
}

Predator.hungerSteps = 8;
Predator.range = 10;