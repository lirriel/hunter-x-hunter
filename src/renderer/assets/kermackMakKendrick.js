export function kermackMakKendrick(S, I, R, b, m, g) {
    const N = S + I + R;
    return {
        ds: -b * S * I + m * (N - S),
        di: b * S * I - g * I - m * I,
        dr: g * I - m * R
    }
}

export function kermackMakKendrickSIS(S, I, b, m, g) {
    const N = S + I;
    return {
        ds: -b * S * I + m * (N - S) + g * I,
        di: b * S * I - g * I - m * I
    }
}