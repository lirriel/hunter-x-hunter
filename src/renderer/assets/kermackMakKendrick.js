import {Model} from "./lotkaVolterra";

export class KermackMakKendrick extends Model {
    constructor(b, m, g) {
        super();
        this.b = b;
        this.m = m;
        this.g = g;
    }

    calculateModel(S, I, R) {
        const N = S + I + R;
        return {
            ds: -this.b * S * I + this.m * (N - S),
            di: this.b * S * I - this.g * I - this.m * I,
            dr: this.g * I - this.m * R
        }
    }
}

export class KermackMakKendrickSIS extends KermackMakKendrick {
    constructor(b, m, g) {
        super(b, m, g)
    }

    calculateModel(S, I, R) {
        const N = S + I;
        return {
            ds: -this.b * S * I + this.m * (N - S) + this.g * I,
            di: this.b * S * I - this.g * I - this.m * I,
            dr: 0
        }
    }
}