class SimulatedAnnealing {
    constructor() {
        this._temperature = pow(k, 3);
        this._coolingRate = 0.999999;
        this._length = Infinity;

        this._finished = false;

        this._name = "Simulated Annealing";
        this._summary = "Swaps cities at random and keeps the change if it helps. Worse routes are accepted too, less and less often as the temperature falls.";
    }

    findPath() {
        let new_cities = this.specialSwap(cities.slice());
        let cost = calcDistance(new_cities);
        let difference = cost - this._length;

        if (difference < 0 || Math.exp(-difference / this._temperature) > Math.random()) {
            cities = new_cities.slice();
            path = new_cities.slice();
            this._length = cost;
        }

        this._temperature *= this._coolingRate;
    }

    specialSwap(array) {
        let r = (a) => int(random(a));
        let a = r(array.length);
        let b = r(array.length);

        swap(array, a, b);

        return array;
    }
}
