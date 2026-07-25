class LexicographicOrder {
    constructor() {
        this._finished = false;

        this._name = "Lexicographic Order";
        this._summary = "Steps through every permutation of the cities in order. Exact, but the number of routes grows with the factorial of the city count.";

        for (let i = 0; i < k; i++) {
            cities[i]._id = i;
        }
    }

    findPath() {
        let x = 0;
        for (let i = k - 2; i >= 0; i--) {
            if (cities[i]._id < cities[i + 1]._id) {
                x = i;
                break;
            }
        }

        let y = -1;
        for (let i = 0; i < k; i++) {
            if (cities[x]._id < cities[i]._id) {
                y = i;
            }
        }

        this._finished = (y === -1);

        if (!this._finished) {
            swap(cities, x, y);

            // Reverse from x + 1 to the end
            let tail = cities.splice(x + 1);
            tail.reverse();
            cities = cities.concat(tail);
        }

        path = cities.slice();
    }
}
