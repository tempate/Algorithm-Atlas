class Merge {
    constructor() {
        this._finish = false;
        this._divided = false;
        this._ordered = [];

        this._name = "Merge Sort";
        this._summary = "Divides the list into buckets smaller than 3, orders each bucket and merges the different buckets.";
    }

    order() {
        if (!this._divided) {
            this.divide(numbers.slice());
            this._divided = true;
        }

        for (let i = this._ordered.length - 2; i >= 0; i -= 2) {
            this._ordered.push(this.merge(this._ordered[i], this._ordered[i + 1]));
            this._ordered.splice(i, 2);
        }

        this.convert();

        if (this._ordered.length === 1)
            this._finish = true;
    }

    divide(array) {
        if (array.length <= 2) {
            if (array.length === 2 && array[0] > array[1])
                swap(array, 0, 1);
            if (array.length !== 0) this._ordered.push(array);
        } else {
            const half = int(array.length / 2);
            this.divide(array.slice(0, half));
            this.divide(array.slice(half));
        }
    }

    merge(a, b) {
        let new_array = [];
        const len = a.length + b.length;

        for (let i = 0, m = 0, n = 0; i < len; i++) {
            if (m === a.length) {
                for (var j = n; j < b.length; j++)
                    new_array.push(b[j]);
                break;
            } else if (n === b.length) {
                for (var j = m; j < a.length; j++)
                    new_array.push(a[j]);
                break;
            } else {
                new_array[i] = (a[m] < b[n]) ? a[m++] : b[n++];
            }
        }

        return new_array;
    }

    convert() {
        let array = [];

        for (let i = 0; i < this._ordered.length; i++) {
            for (let j = 0; j < this._ordered[i].length; j++)
                array.push(this._ordered[i][j]);
        }

        numbers = array.slice();
    }
}
