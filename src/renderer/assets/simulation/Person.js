import {Organism, removeOrganism, turnStep} from "./Organism";
import {Predator} from "./Predator";
import {Prey} from "./Prey";

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
                var huntTurnStep = turnStep(i, this.x, this.y);
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
        var turnPosition = turnStep(moveNumber, this.x, this.y);
        this.setPosition(turnPosition.x, turnPosition.y);
    }

    moveHunter(organisms, maxX, maxY) {
        this.tickAge();
        if (this.age > this.lifespan || this.hungerStepsCounter <= 0) {
            organisms = organisms.splice(organisms.indexOf(this), 1);
            return;
        }
        let minPredatorDist = Number.MAX_SAFE_INTEGER;
        let closestPredator = null;

        let minPreyDist = Number.MAX_SAFE_INTEGER;
        let closestPrey = null;
        killRangeOrganisms = [];
        huntRangeOrganisms = [];
        for (let i = 0; i < organisms.length; i++) {
            let currentOrganism = organisms[i];
            if (currentOrganism instanceof Prey || currentOrganism instanceof Predator) {
                let dist = currentOrganism.calculateDistanceWith(this);

                if (dist <= this.killRange) {
                    killRangeOrganisms.push(currentOrganism)
                } else if (dist <= this.noticeOrganismRange) {
                    huntRangeOrganisms.push(currentOrganism)
                }

                if (currentOrganism instanceof Prey) {
                    if (dist < minPreyDist) {
                        closestPrey = currentOrganism;
                        minPreyDist = dist;
                    }
                } else if (currentOrganism instanceof Predator) {
                    if (dist < minPredatorDist) {
                        closestPredator = currentOrganism;
                        minPredatorDist = dist;
                    }
                }
            }
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
        } else {
            this.move(organisms, x, y);
        }
    }
}

Person.preyNeedLimit = 10;
Person.preyNeedCounter = 0;

Person.preyNeedStepsLimit = 12;
Person.preyNeedStepsCounter = 0;

Person.hungerSteps = 4;
