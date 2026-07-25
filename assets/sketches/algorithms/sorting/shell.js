class Shell {
    constructor() {
        this._finish = false;
        this._gap = Math.floor(numbers.length / 2);

        this._name = "Shell Sort";
        this._summary = "Splits the numbers into gaps. Compares elements in a gap, swaping them when the biggest one is on the left. It then divides the gap by 2 until it gets to 0.";
    }

    order() {
        this.sortArray();
        this._gap = Math.floor(this._gap / 2);
        this._finish = (this._gap == 0);
    }

    sortArray() {
        for (let i = 0; i < numbers.length - this._gap; i++) {
            if (numbers[i] > numbers[i + this._gap]) {
                swap(numbers, i, i + this._gap);

                while (i > this._gap) {
                    i -= this._gap;
                    if (numbers[i] > numbers[i + this._gap])
                        swap(numbers, i, i + this._gap);
                }
            }
        }
    }
}
