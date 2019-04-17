export function kolmogorov(n1, n2, alphaFunc, vFunc, kFunc) {
    return {
        dn1: alphaFunc(n1) * n2 - vFunc(n1) * n2,
        dn2: kFunc(n2) * n2
    }
}