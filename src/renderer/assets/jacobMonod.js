import {Model} from "./lotkaVolterra";

export class JacobMonod extends Model{
    constructor(sIn, q, dr, alpha, mFunc) {
        super();
        this.sIn = sIn;
        this.q = q;
        this.dr = dr;
        this.alpha = alpha;
        this.mFunc= mFunc;
    }

    calculateModel(x, s) {
        return  {
            dx: this.mFunc(s) * x - this.dr * x,
            ds: - this.alpha * this.mFunc(s) * x - this.dr * s + this.dr * this.sIn
        }
    }
}
