export function jacobMonod(x, s, sIn, q, dr, alpha, mFunc) {
    return  {
        dx: mFunc(s) * x - dr * x,
        ds: - alpha * mFunc(s) * x - dr * s + dr * sIn
    }
}