/**
 * Basic Lotka-Volterra model
 * @param x prey
 * @param y predator
 * @param a alpha
 * @param b beta
 * @param g1 gamma1
 * @param g2 gamma2
 * @returns {{prey: number, predator: number}}
 */
export function lotkaVolterra(x, y, a, b, g1, g2) {
    return {
        prey: x * (a - g1 * y),
        predator: (g2 * x - b) * y
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

export function phasePortrait(x0, y0, x, y, alpha, beta) {
    var x_rate = x0 / x;
    var y_rate = y0 / y;
    var X = Math.pow((Math.exp(x_rate) / x_rate), beta);
    var Y = Math.pow((Math.exp(y_rate) / y_rate), alpha);
    return X * Y;
}