export function lotkaVolterra(x, y, a, b, g1, g2) {
    const resultSet = {
        prey: x * (a - g1 * y),
        predator: (g2 * x - b) * y
    }
    return resultSet
}