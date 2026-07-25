class opt2 {
    constructor() {
        this._m = 0;
        this._n = 1;

        this._finished = false;
        this._changed = false;

        this._name = "2-opt"
        this._summary = "Reverses a section of the route whenever doing so makes it shorter, repeating until no single reversal is an improvement."
    }

    findPath() {
        if (this._m < k - 1) {
            if (this._n < k) {
                let new_path = this.optSwap(best.slice(), this._m, this._n);
                path = new_path.slice();
                this._n++;
            } else {
                this._m++;
                this._n = this._m + 1;
            }

            if (calcDistance(path) < record)
                this._changed = true;
        } else if (this._changed) {
            this._changed = false;
            this._m = 0;
        } else {
            this._finished = true;
        }
    }

    optSwap(current, m, n) {
        let a = current.slice(0, m);
        let b = current.slice(m, n + 1);
        let c = current.slice(n + 1);

        let path = a.slice();
        b.reverse();
        path = path.concat(b);
        path = path.concat(c);

        return path;
    }
}
