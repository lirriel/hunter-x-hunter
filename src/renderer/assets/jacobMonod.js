import {Model} from "./lotkaVolterra";

// https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4391987/
export class JacobMonod extends Model {
    /**
     * @param sIn concentration of the limiting nutrient
     * @param dr the culture dilution rate
     * @param alpha The number of cells produced per mole of the limiting nutrient
     * @param mMax half-maximal of hyperbolic function
     * @param K substrate concentration
     */
    constructor(sIn, dr, alpha, mMax, K) {
        super();
        this.sIn = sIn;
        this.dr = dr;
        this.alpha = alpha;
        this.mMax = mMax;
        this.K = K;
    }

    getFormula() {
        return "\\begin{cases} " +
            "\\frac{dBacteria}{dt}=\\frac{\\mu_{max}*s}{K+s}*Bacteria-dr*Bacteria& \\\\ " +
            "\\frac{dNutrient}{dt}=\\alpha*\\frac{\\mu_{max}*s}{K+s}*Bacteria-dr*s_dr*s_{In}&" +
            "\\end{cases}"
    }

    calculateModel(x, s) {
        let f = this.getMonodCurve(s);
        return {
            dx: f * x - this.dr * x,
            ds: -this.alpha * f * x - this.dr * s + this.dr * this.sIn
        }
    }

    getMonodCurve(s) {
        return this.mMax * s / (this.K + s)
    }

}
