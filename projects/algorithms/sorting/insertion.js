class Insertion {
    constructor() {
        this._ordered = [numbers[0]];
        this._finish = false;
        this._j = 1;

        this._name = "Insertion";
        this._summary = "Takes elements one by one, inserting them in their correct position.";
    }

    order() {
        if (this._j === numbers.length)
            return this._finish = true;

        for (let i = this._ordered.length - 1; i >= 0; i--) {
            if (numbers[this._j] > this._ordered[i]) {
                this._ordered.splice(i + 1, 0, numbers[this._j++]);
                break;
            } else if (i === 0) {
                this._ordered.splice(0, 0, numbers[this._j++]);
            }
        }

        this.update();
    }

    update() {
        for (let i = 0; i < this._ordered.length; i++)
            numbers[i] = this._ordered[i];
    }
}
