export class Organism {
    constructor(lifespan, adulthoodAge, birthPeriod, x, y) {
        this.lifespan = lifespan;
        this.adulthoodAge = adulthoodAge;
        this.x = x;
        this.y = y;
        this.birthPeriod = birthPeriod;
        this.birthPeriodTimer = birthPeriod;
        this.age = 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    tickAge() {
        this.age++;
        if (this.age >= this.adulthoodAge) {
            if (this.birthPeriodTimer === 0) {
                this.birthPeriodTimer = this.birthPeriod;
            }
            this.birthPeriodTimer--;
        }
    }

    calculateDistanceWith(otherOrganism) {
        return Math.sqrt(Math.pow(this.x - otherOrganism.x, 2) + Math.pow(this.y - otherOrganism.y, 2))
    }

    calculateDistance(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
    }

    move(organisms, maxGridX, maxGridY) {
        var surroundingArray = this.checkCoordinates(organisms, maxGridX, maxGridY);
        var newSpot = this.findFreeSpot(surroundingArray);
        if (newSpot) {
            this.setPosition(newSpot.x, newSpot.y);
        }
    }

    checkCoordinates(organisms, maxGridX, maxGridY) {
        var surroundingArray = Array(8).fill(true);
        if (this.x <= 0) {
            surroundingArray[0] = surroundingArray[7] = surroundingArray[6] = false;
        }
        if (this.y <= 0) {
            surroundingArray[0] = surroundingArray[1] = surroundingArray[2] = false;
        }
        if (this.x >= maxGridX) {
            surroundingArray[2] = surroundingArray[3] = surroundingArray[4] = false;
        }
        if (this.y >= maxGridY) {
            surroundingArray[6] = surroundingArray[5] = surroundingArray[4] = false;
        }
        let current = this;
        organisms.forEach(function (organism) {
            for (let i = 0; i < 8; i++) {
                if (surroundingArray[i] === true) {
                    let position = turnStep(i, current.x, current.y);
                    if (position.x === organism.x && position.y === organism.y) {
                        surroundingArray[i] = false;
                    }
                }
            }
        });
        return surroundingArray;
    }

    findFreeSpot(surroundingArray) {
        var countEmpty = 0;
        for (let i = 0; i < 8; i++) {
            if (surroundingArray[i] === true) {
                countEmpty++;
            }
        }
        if (countEmpty === 0) {
            return;
        }
        let randomPosition = randomInteger(0, 7);
        let currentPosition = 0;
        while (currentPosition < 8) {
            if (surroundingArray[randomPosition] === true) {
                var newPosition = turnStep(randomPosition, this.x, this.y);
                return {x: newPosition.x, y: newPosition.y};
            } else {
                currentPosition++;
                randomPosition++;
                randomPosition %= 8;
            }
        }
        return {x: this.x, y: this.y};
    }

}

export function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

export function turnStep(caseNumber, x, y) {
    var newX = x;
    var newY = y;
    switch (caseNumber) {
        case 0:
            newX--;
            newY--;
            break;
        case 1:
            newY--;
            break;
        case 2:
            newX++;
            newY--;
            break;
        case 3:
            newX++;
            break;
        case 4:
            newX++;
            newY++;
            break;
        case 5:
            newY++;
            break;
        case 6:
            newX--;
            newY++;
            break;
        case 7:
            newX--;
            break;
        default:
    }
    return {x: newX, y: newY}
}

export function removeOrganism(organisms, organism) {
    organisms.splice(organisms.indexOf(organism), 1);
}