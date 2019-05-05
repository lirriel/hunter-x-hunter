export class Model {
    constructor() {
    }

    jacobianTrace(j) {
        return j[0][0] + j[1][1];
    }

    jacobianDet(j) {
        return j[0][0] * j[1][1] - j[1][0] * j[0][1];
    }

    jacobianAnalysis(j) {
        let tr = this.jacobianTrace(j);
        let det = this.jacobianDet(j);
        let d = tr * tr - 4 * det;
        if (det > 0) {
            if (d <= 0) {
                if (tr > 0) {
                    return "unstable node"
                } else if (tr < 0) {
                    return "stable node"
                } else {
                    return "non-hyperbolic equilibria"
                }
            } else {
                if (tr > 0) {
                    return "unstable focus"
                } else if (tr < 0) {
                    return "stable focus"
                } else {
                    return "non-hyperbolic equilibria"
                }
            }
        } else if (det < 0) {
            return "saddle"
        } else if (det === 0) {
            return "non-hyperbolic equilibria"
        }
    }

}

export class BasicLotkaVolterra extends Model {
    constructor(alpha, gamma1, beta, gamma2) {
        super();
        this.a = alpha;
        this.g1 = gamma1;
        this.b = beta;
        this.g2 = gamma2;
    }

    /**
     * Basic Lotka-Volterra model
     * @param x prey
     * @param y predator
     * @returns {{prey: number, predator: number}}
     */
    calculateModel(x, y) {
        return {
            prey: x * (this.a - this.g1 * y),
            predator: (this.g2 * x - this.b) * y
        }
    }

    phaseSpacePlot(x, y) {
        return this.b * x - this.g2 * Math.log(x) + this.g1 * y - this.a * Math.log(y)
    }

    getEquilibrium() {
        return [
            [0, 0],
            [this.b / this.g2, this.a / this.g1]
        ]
    }

    jacobian(x, y) {
        return [
            [this.a - this.g1 * y, -this.g1 * x],
            [this.b * y, this.b * x - this.g2]
        ]
    }

    period() {
        return Math.sqrt(this.a * this.b)
    }
}

// http://www.cds.caltech.edu/~murray/amwiki/index.php/Predator_prey
export class LotkaVolterraContiniousTimeFiniteCapacity extends Model {

    constructor(r, k, a, c, b, d) {
        super();
        this.r = r;
        this.k = k;
        this.a = a;
        this.c = c;
        this.b = b;
        this.d = d;
    }

    calculateModel(x, y) {
        return {
            prey: this.r * x * (1 - x / this.k) - this.a * x * y / (this.c + x),
            predator: this.b * this.a * x * y / (this.c + x) - this.d * y
        }
    }

    getEquilibrium() {
        return [
            [0, 0],
            [this.k, 0],
            [
                this.c * this.d / (this.a * this.b - this.d),
                this.b * this.c * this.r * (this.a * this.b * this.k - this.c * this.d - this.d * this.k) / (Math.pow(this.a * this.b - this.d, 2) * this.k)
            ]
        ]
    }

    jacobian(x, y) {
        return [
            [
                -this.a * this.c * x / Math.pow(this.c + y, 2) - 2 * y * this.r / this.k + this.r
                , -this.a * y / (this.c + y)
            ],
            [
                this.a * this.b * this.c * x / Math.pow(this.c + y, 2),
                -this.a * this.b * y / (this.c + y) - this.d
            ]
        ]
    }
}


// www.researchgate.net/publication/259412939_Stabaility_analysis_of_a_lotka-volterra_type_predator-prey_system_involving_allee_effects
export class LotkaVolterraContiniousTimeAlleeEffect {
    constructor(r, a, b) {
        this.r = r;
        this.a = a;
        this.b = b;
    }

    alle(x) {
        return x / (this.b + x);
    }

    calculateModel(x, y) {
        let p = null;
        if (this.b === null) {
            p = this.r * x(1 - x) - this.a * x * y;
        } else {
            p = this.r * this.alle(x) * x * (1 - x) - this.a * x * y;
        }
        return {
            prey: p,
            predator: this.a * y * (x - y)
        }
    }

    getEquilibrium() {
        let _x = null;
        if (this.b === null) {
            _x = this.r / (this.a + this.r);
        } else {
            _x = (this.r - this.a * this.b) / (this.a + this.r);
        }
        return [
            [0, 0],
            [1, 0],
            [_x, _x]
        ]
    }

    jacobian(x, y) {
        if (this.b === null) {
            return [
                [this.r - 2 * this.r * x - this.a * y, -this.a * x],
                [this.a * y, this.a * x - 2 * this.a * y]
            ]
        } else {
            let t = this.r - this.a * this.b;
            return [
                [
                    t * (2 * this.r * this.a * this.b + this.a * this.a * this.b - this.r * this.r) / (this.r * (this.r + this.a) * (this.b + 1)),
                    -this.a * t / (this.r + this.a)
                ],
                [
                    this.a * t / (this.r + this.a),
                    -this.a * t / (this.r + this.a)
                ]
            ]
        }
    }
}

export class LotkaVolterraFiniteCapacity extends Model {
    constructor(a, b, c, d, K) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.K = K;
    }

    /**
     * Lotka-Volterra model with finite carrying capacity for the prey
     * @param x prey
     * @param y predator
     * @returns {{prey: number, predator: number}}
     */
    calculateModel(x, y) {
        return {
            prey: x * (this.b * (1 - x / this.K) - this.a * y),
            predator: (this.c * this.a * x - this.d) * y
        }
    }

    jacobian(x, y) {
        return [
            [this.b * (1 - x / this.K) - this.a * y, -x * this.a],
            [this.c * this.a * y, this.c * this.a * x - this.d]
        ]
    }
}

export class RosenzweigMacArthur extends Model {
    constructor(k, m, c) {
        super();
        this.k = k;
        this.m = m;
        this.c = c;
    }

    calculateModel(x, y) {
        return {
            prey: x * (1 - x / this.k) - (this.m * x * y) / (1 + x),
            predator: -this.c * y + (this.m * x * y) / (1 + x)
        }
    }

    getEquilibrium() {
        let _x = this.c / (this.m - this.c);
        let _y = _x / this.c * (1 - _x / this.k);
        return [
            [0, 0],
            [this.k, 0],
            [_x, _y]
        ]
    }

    jacobian(x, y) {
        return [
            this.jacobian_1(x, y),
            this.jacobian_2(x, y)
        ]
    }

    jacobian_1(x, y) {
        let t = -this.m * this.k / (1 + this.k);
        return [
            [-1, -t],
            [0, t - this.c]
        ]
    }

    jacobian_2(_x, _y) {
        let t = -this.m * _y / Math.pow(1 + _x, 2);
        return [
            [-1 - 2 * _x / this.k - t, -this.c],
            [t, 0]
        ]
    }

    jacobianTrace(_x, _y) {
        return 1 - 2 * _x / this.k - (1 / (1 + _x)) * (1 - _x / this.k)
    }

    getCoexistenseEquilibrium() {
        let t = (this.m + this.c) / (this.m - this.c);
        if (this.k < t) {
            return "sink"
        }
        if (this.k > t) {
            return "source"
        }
        return "Hopf bifurcation"
    }
}