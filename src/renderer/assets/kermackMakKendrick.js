import {Model} from "./lotkaVolterra";

export class BasicSIR extends Model {
    constructor(b, q) {
        super();
        this.b = b;
        this.q = q;
    }

    calculateModel(S, I, R) {
        return {
            ds: -this.b * S * I,
            di: this.b * S * I - this.q * I,
            dr: this.q * I
        }
    }

    getEquilibrium(s_0, i_0, r_0) {
        let n_0 = s_0 + i_0;
        return [
            [0, n_0, 0],
            [0, this.q / this.b, n_0 - this.q / this.b]
        ]
    }

    getPhaseTrajectories(i, s) {
        let p = this.q / this.b;
        return i + s - p * Math.log(s)
    }

    getAnalysis(s_0, i_0, eps) {
        let p = this.q / this.b;
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
        return " - "
    }

    getBasicReproductionNumber(s) {
        return this.b * s / this.q;
    }

    getEpidemicThresholdAnalysis(s) {
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

    getPeakAnalysis(s_0, r) {
        let u = this.b / this.q * r;
        let q = this.q / (this.b * s_0);
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
        let u = this.b / this.q * r;
        let p = (s + i + r) / s_0;
        let q = this.q / (this.b * s_0);
        return [u, p - q * u - Math.exp(-u)];
    }
}

// m - rate which recovered individuals return to the
// susceptible statue due to loss of immunity.
export class SIRS extends BasicSIR {
    constructor(b, m, q) {
        super(b, q);
        this.b = b;
        this.m = m;
        this.q = q;
    }

    calculateModel(S, I, R) {
        const N = S + I + R;
        return {
            ds: -this.b * S * I / N + this.m * (N - S),
            di: this.b * S * I / N - this.q * I - this.m * I,
            dr: this.q * I - this.m * R
        }
    }
}

export class SIRSwithVital extends SIRS {
    constructor(b, m, q, v, mor) {
        super(b, m, q);
        this.v = v;
        this.mor = mor;
    }

    calculateModel(S, I, R) {
        const N = S + I + R;
        console.log(this.b + " " + this.m + " " + N)
        return {
            ds: this.mor * N - this.b * S * I / N + this.m * R - this.v * S,
            di: this.b * S * I / N - this.q * I - this.m * I,
            dr: this.q * I - this.m * R - this.v * R
        }
    }

    getEquilibrium(s_0, i_0, r_0) {
        return [
            [1, 0, 0],
            []
        ]
    }
}

export class KermackMakKendrickSIS extends SIRS {
    constructor(b, m, q) {
        super(b, m, q)
    }

    calculateModel(S, I, R) {
        const N = S + I;
        return {
            ds: -super.b * S * I + super.m * (N - S) + super.q * I,
            di: super.b * S * I - super.q * I - super.m * I,
            dr: 0
        }
    }

    spreadAnalysis(s) {
        let s0 = super.b / super.q;
        if (s >= s0) {
            return "susceptible monotonically decreases with time." +
                " No epidemic can occur."
        } else {
            return "The number of infecteds increases."
        }
    }

    getJacobian(s, i) {
        return [
            [0, super.b - super.q * (s + i)],
            [0, super.q * (s + i) - super.b]
        ]
    }

    getEquilibrium(s_0, i_0, r_0) {
        return [
            [super.b / super.q, (s_0 + i_0) - super.b / super.q, 0]
        ];
    }

    getEquilibriumAnalysis(s, i) {
        const t = super.q * (s + i) - super.b;
        if (t < 0) {
            return "stable"
        }
        if (t > 0) {
            return "unstable"
        }
        return "threshold t = 0"
    }
}