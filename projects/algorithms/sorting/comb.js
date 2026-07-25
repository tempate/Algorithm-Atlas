class Comb {
    constructor() {
        this._finish = false;
        this._gap = k;

        this._name = "Comb Sort";
        this._summary = "Improved Bubble Sort. It exchanges elements within a gap distance which is divided for every complete period between 1.25.";
    }

    order() {
        let modified = false;
        for (let i = 0; i < numbers.length - this._gap; i++) {
            if (numbers[i] > numbers[i + this._gap]) {
                swap(numbers, i, i + this._gap);
                modified = true;
            }
        }

        this._gap = Math.floor(this._gap / 1.25);
        this._finish = !modified && this._gap === 1;
    }
}
