class Bubble {
    constructor() {
        this._finish = false;

        this._name = "Bubble Sort";
        this._summary = "Compares each pair of adjacent items and swaps them if necessary."
    }


    order() {
        let swapped = false;

        for (let i = numbers.length - 2; i >= 0; i--) {
            if (numbers[i + 1] < numbers[i]) {
                swap(numbers, i, i + 1);
                swapped = true;
            }
        }

        this._finish = !swapped;
    }
}
