
class Organism {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.mutationSize = 20; //Must be greater than 2
    }
    reproduce() {
        // Prevents negative numbers from appearing
        let newR = Math.max(this.r + this.mutateTrait(), 0);
        let newG = Math.max(this.g + this.mutateTrait(), 0);
        let newB = Math.max(this.b + this.mutateTrait(), 0);
        return new Organism(newR, newG, newB);
    }

    mutateTrait() {
        let multiplier = Math.random() - 0.5;
        if(multiplier < 0) {
            return randomValue(this.mutationSize) * -1;
        } else {
            return randomValue(this.mutationSize);
        }
    }
}

function randomValue(range) {
    return Math.floor(Math.random() * range);
}

export class Environment {
    constructor(r, g, b, startingOrganisms) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.organisms = [];
        this.weaknesses = [];
        this.startingOrganisms = startingOrganisms;
        this.addOrganisms(this.startingOrganisms);
        this.generationTime = 100
    }

    // Begins Running the simulation
    run() {
        let e = this;
        let generation = 1;
        setInterval(() => {
            e.replaceOrganism();
            console.log(`Generation:  ${generation}`);
            console.log(`Average Weaknesses is now: ${e.computeAverageWeakness()}`);
            generation++;
        }, e.generationTime);
    }

    // Adds a list of organisms with random fitnesses
    addOrganisms(num) {
        while(num > 0) {
            let newOrganism = new Organism(randomValue(256), randomValue(256), randomValue(256));
            this.organisms.push(newOrganism);
            this.weaknesses.push(this.calculateWeakness(newOrganism));
            num -= 1;
        }
    }

    calculateWeakness(organism) {
        return (Math.abs(this.r - organism.r) + Math.abs(this.g - organism.g) + Math.abs(this.b - organism.b));
    }

    replaceOrganism() {
        let e = this;

        // 1) Select a Random organism to reproduce
        let randomIndex = randomValue(this.organisms.length)
        let parentOrganism = this.organisms[randomIndex];
        let newOrganism = parentOrganism.reproduce();

        // 2) Use intervals to weight individuals by weakness
        let intervals = createIntervals(this.weaknesses);
        let intervalRange = intervals[intervals.length - 1][1]; //Sum of all weaknesses

        let randomOrganismToReplace = randomValue(intervalRange);

        // 3) Remove a random individual, weighted by weakness
        intervals.forEach((interval, index) => {
            if(isWithinInterval(interval, randomOrganismToReplace)) {
                e.organisms[index] = newOrganism;
                e.weaknesses[index] = e.calculateWeakness(newOrganism);
            }
        });
    }

    // Compute the average weakness of the population
    computeAverageWeakness() {
        return this.weaknesses.reduce((sum, current) => sum + current)/ (this.weaknesses.length);
    }
}

function isWithinInterval(interval, num) {
    return interval[0] <= num && num < interval[1];
}

function createIntervals(arr) {
    let runningTotal = 0;
    let result = arr.map(int => {
        let newTotal = runningTotal + int;
        let result = [runningTotal, newTotal]
        runningTotal = newTotal;
        return result;
    });
    return result;
}

