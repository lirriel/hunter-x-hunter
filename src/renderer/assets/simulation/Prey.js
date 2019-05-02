import {Organism, randomInteger} from "./Organism";

export class Prey extends Organism {
    constructor(lifespan, adulthoodAge, birthPeriod, x, y) {
        super(lifespan, adulthoodAge, birthPeriod, x, y)
    }

    movePrey(organisms, maxX, maxY) {
        this.tickAge();
        if (this.age > this.lifespan) {
            organisms = organisms.splice(organisms.indexOf(this), 1);
            return;
        }
        let surrounding = this.checkCoordinates(organisms, maxX, maxY);
        let freeSpotPosition = this.findFreeSpot(surrounding);
        if (!freeSpotPosition) {
            freeSpotPosition = {x: this.x, y: this.y}
        }
        if (this.age > this.adulthoodAge
            && this.birthPeriodTimer === 0
            && (freeSpotPosition.x !== this.x || freeSpotPosition.y !== this.y)
        ) {
            var newPrey = new Prey(randomInteger(50, 100), this.adulthoodAge,
                this.birthPeriod, freeSpotPosition.x, freeSpotPosition.y);
            organisms.push(newPrey);
            this.birthPeriodTimer = this.birthPeriod;
        } else {
            this.move(organisms, maxX, maxY)
        }
    }
}