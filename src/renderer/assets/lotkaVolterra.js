/**
 * Basic Lotka-Volterra model
 * @param x prey
 * @param y predator
 * @param alpha alpha
 * @param beta beta
 * @param gamma1 gamma1
 * @param gamma2 gamma2
 * @returns {{prey: number, predator: number}}
 */
export function lotkaVolterra(x, y, alpha, gamma1, beta, gamma2) {
    return {
        prey: x * (alpha - gamma1 * y),
        predator: (gamma2 * x - beta) * y
    }
}

export function rosenzweigMacArthur(x, y, k, m, c) {
    return {
        prey: x * (1 - x / k) - (m * x * y) / (1 + x),
        predator: -c * y + (m * x * y) / (1 + x)
    }
}

/**
 * Lotka-Volterra model with finite carrying capacity for the prey
 * @param x prey
 * @param y predator
 * @param a alpha
 * @param b beta
 * @param g1 gamma1
 * @param g2 gamma2
 * @param K prey finite carrying capacity
 * @returns {{prey: number, predator: number}}
 */
export function lotkaVolterraWithFiniteCapacity(x, y, a, b, g1, g2, K) {
    return {
        prey: x * a * (1 - x / K) - g1 * y,
        predator: (g2 * x - b) * y
    }
}

// include logistic growth
// http://www.cds.caltech.edu/~murray/amwiki/index.php/Predator_prey
export function lotkaVolterraContiniousTime(x, y, r, k, a, c, b, d) {
    return {
        prey: r * x * (1 - x / k) - a * x * y / (c + x),
        predator: b * a * x * y / (c + x) - d * y
    }
}

export function lotkaVolterraContiniousTimeEquilibrium(r, k, a, c, b, d) {
    return [
        [0, 0],
        [k, 0],
        [
            c * d / (a * b - d),
            b * c * r * (a * b * k - c * d - d * k) / (Math.pow(a * b - d, 2) * k)
        ]
    ]
}

export function phasePortrait(x0, y0, x, y, alpha, beta) {
    var x_rate = x0 / x;
    var y_rate = y0 / y;
    var X = Math.pow((Math.exp(x_rate) / x_rate), beta);
    var Y = Math.pow((Math.exp(y_rate) / y_rate), alpha);
    return X * Y;
}