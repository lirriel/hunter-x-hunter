import {Organism, randomInteger, removeOrganism, turnStep} from "./Organism";
import {Prey} from "./Prey";

export class Predator extends Organism {
    constructor(lifespan, adulthoodAge, birthPeriod, feedPreyCount, x, y) {
        super(lifespan, adulthoodAge, birthPeriod, x, y);
        this.hunger = Predator.hungerSteps;
        this.feedPreyCount = feedPreyCount;
        this.feedPreyTimer = 0;
    }

    setHungerSteps(steps) {
        Predator.hungerSteps = steps;
    }

    calculateInstinct(organisms, huntedPrey, maxX, maxY) {
        var surrounding = this.checkCoordinates(organisms, maxX, maxY);
        var huntedDistance = Array(8).fill(Number.MAX_SAFE_INTEGER);
        for (let i = 0; i < 8; i++) {
            if (surrounding[i] === true) {
                var huntTurnStep = turnStep(i, this.x, this.y);
                huntedDistance[i] = huntedPrey.calculateDistance(huntTurnStep.x, huntTurnStep.y);
            }
        }
        var minDist = maxX * maxY;
        var moveNumber = -1;
        for (let it = 0; it < 8; it++) {
            if ((surrounding[it] === true) && (huntedDistance[it] < minDist)) {
                minDist = huntedDistance[it];
                moveNumber = it;
            }
        }
        var turnPosition = turnStep(moveNumber, this.x, this.y);
        this.setPosition(turnPosition.x, turnPosition.y);
    }

    movePredator(organisms, maxX, maxY) {
        this.tickAge();
        if (this.age > this.lifespan || this.hunger <= 0) {
            removeOrganism(organisms, this);
            return;
        }
        var currentPredator = this;
        var minDist = Number.MAX_SAFE_INTEGER;
        var prey = null;
        var preyFlag = false;
        for (let i = 0; i < organisms.length; i++) {
            let organism = organisms[i];
            if (organism instanceof Prey) {
                preyFlag = true;
                var distance = organism.calculateDistanceWith(currentPredator);
                if (distance <= Math.sqrt(2)) {
                    removeOrganism(organisms, organism);
                    // organisms = organisms.splice(organisms.indexOf(organism), 1);
                    currentPredator.hunger = Predator.hungerSteps;
                    currentPredator.feedPreyTimer++;
                    if (currentPredator.feedPreyTimer >= currentPredator.feedPreyCount) {
                        var surrounding = currentPredator.checkCoordinates(organisms, maxX, maxY);
                        var position = currentPredator.findFreeSpot(surrounding);

                        if (position.x !== currentPredator.x && position.y !== currentPredator.y) {
                            var newPredator = new Predator(randomInteger(80, 90),
                                currentPredator.adulthoodAge, currentPredator.birthPeriod,
                                currentPredator.feedPreyCount, position.x, position.y);
                            organisms.push(newPredator);
                            currentPredator.feedPreyTimer = 0;
                        }
                    }
                } else {
                    if (distance < minDist) {
                        minDist = distance;
                        prey = organism;
                    }
                }
            }
        }
        if (prey !== null) {
            if (minDist < Predator.range) {
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

Predator.hungerSteps = 40;
Predator.range = 10;