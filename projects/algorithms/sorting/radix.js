class Radix {
    constructor() {
        this._finish = false;
        this._digit = 1;
        this._k = 10000;

        this._name = "Radix (LSD)";
        this._summary = "Generates a sorted list by positioning a number in the position of the current digit (d).";
    }

    order() {
        this.adjustNumbers();
        numbers = this.lsd();
        this.reverseAdjustment();
    }

    adjustNumbers() {
        for (let i = 0; i < numbers.length; i++)
            numbers[i] = int(numbers[i] * this._k);
    }

    lsd() {
        let array = [];
        let modified = false;

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < numbers.length; j++) {
                let digit = this.getDigit(numbers[j]);
                if (digit === i) {
                    array.push(numbers[j]);
                    modified = true;
                } else if (i == 0 && digit == undefined) {
                    array.push(numbers[j]);
                }
            }
        }

        this._digit++;
        this._finish = !modified;
        return array.slice();
    }

    getDigit(number) {
        let string = number.toString();
        return int(string[string.length - this._digit]);
    }

    reverseAdjustment() {
        for (let i = 0; i < numbers.length; i++)
            numbers[i] /= this._k;
    }
}
