export function jacobMonod(x, s, sIn, q, dr, alpha, mFunc) {
    console.log(mFunc(s))
    return  {
        dx: mFunc(s) * x - dr * x,
        ds: - alpha * mFunc(s) * x - dr * s + dr * sIn
    }
}

export function standardMuFunction(_s) {
    return this.muMax * _s / (_s + this.k);
}
