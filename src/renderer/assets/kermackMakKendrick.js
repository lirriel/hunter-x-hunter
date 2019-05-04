import {Model} from "./lotkaVolterra";

export class BasicSIR extends Model {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    calculateModel(S, I, R) {
        return {
            ds: -this.a * S * I,
            di: this.a * S * I - this.b * I,
            dr: this.b * I
        }
    }

    getEquilibrium(s_0, i_0) {
        let n_0 = s_0 + i_0;
        return [
            [0, n_0, 0],
            [0, this.b / this.a, n_0 - this.b / this.a]
        ]
    }

    getPhaseTrajectories(i, s) {
        let p = this.b / this.a;
        return i + s - p * Math.log(s)
    }

    getAnalysis(s_0, i_0, eps) {
        let p = this.b / this.a;
        let i_max = s_0 + i_0 - p + p * Math.log(p / s_0);
        if (s_0 > p && i_0 > p) {
            if (i_max - i_0 <= eps) {
                return "not severe epidemic"
            }
            return "epidemic ensues"
        }
        if (s_0 < p) {
            return "no epidemic occurs"
        }
    }

    getPeakAnalysis(s_0, r) {
        let u = this.a / this.b * r;
        let q = this.b / (this.a * s_0);
        let dr_f = -q + Math.exp(u);
        if (q < 1) {
            if (dr_f > 0) {
                return "the number of I increases";
            }
            if (dr_f === 0) {
                return "at peak acceleration stops"
            }
        }
    }

    getBehaveCurve(s, i, r, s_0) {
        let u = this.a / this.b * r;
        let p = (s + i + r) / s_0;
        let q = this.b / (this.a * s_0);
        return [u, p - q * u - Math.exp(-u)];
    }
}

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

    getBasicReproductionNumber(s) {
        return this.b * s / this.g;
    }

    immunitizeDependency(s_0, t) {
        return 1 - 1 / (this.getBasicReproductionNumber(s_0))
    }

    getepidEmiologicalThresholdAnalysis(s) {
        let thr = this.getBasicReproductionNumber(s);
        if (thr < 1) {
            return "each person who contracts the disease " +
                "will infect fewer than one person before dying or recovering"
        }
        if (thr > 1) {
            return "each person who gets the disease will infect more" +
                " than one person"
        }
        return "Threshold"
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

    spreadAnalysis(s) {
        let s0 = this.b / this.m;
        if (s >= s0) {
            return "susceptible monotonically decreases with time." +
                " No epidemic can occur."
        } else {
            return "The number of infecteds increases."
        }
    }
}