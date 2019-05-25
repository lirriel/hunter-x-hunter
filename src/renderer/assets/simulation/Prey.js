import {Organism, randomInteger, removeOrganism} from "./Organism";

export class Prey extends Organism {
    constructor(lifespan, adulthoodAge, birthPeriod, x, y) {
        super(lifespan, adulthoodAge, birthPeriod, x, y)
    }

    movePrey(organisms, maxX, maxY) {
        this.tickAge();
        if (this.age > this.lifespan) {
            removeOrganism(organisms, this);
            return;
        }
        let surrounding = this.checkCoordinates(organisms, maxX, maxY);
        let freeSpotPosition = this.findFreeSpot(surrounding);
        if (freeSpotPosition.x !== this.x || freeSpotPosition.y !== this.y) {
            if (this.age > this.adulthoodAge && this.birthPeriodTimer === 0) {
                let newPrey = new Prey(randomInteger(50, 100), this.adulthoodAge,
                    this.birthPeriod, freeSpotPosition.x, freeSpotPosition.y);
                organisms[freeSpotPosition.x][freeSpotPosition.y] = newPrey;
                this.birthPeriodTimer = this.birthPeriod;
            } else {
                this.moveTo(organisms, freeSpotPosition.x, freeSpotPosition.y)
            }
        }
    }
}