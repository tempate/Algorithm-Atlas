class Selection {
    constructor() {
        this._j = 0;
        this._finish = false;

        this._name = "Selection";
        this._summary = "Extracts the lists shortest element. Repeats this until the list is empty.";
    }

    order() {
        if (this._j == numbers.length)
            return this._finish = true;

        let record = 1;
        let index = 0;

        for (let i = this._j; i < numbers.length; i++) {
            if (numbers[i] < record) {
                record = numbers[i];
                index = i;
            }
        }

        swap(numbers, index, this._j++);
    }
}
