class Greedy {
    constructor() {
        this._count = 0;
        this._current = [cities[this._count++]];

        this._name = "Greedy";
        this._summary = "Hops to the nearest city not yet visited. Fast, and usually wrong by a little, because an early cheap hop can strand a distant city for last.";
    }

    findPath() {
        if (this._current.length !== cities.length) {
            let city = this._current[this._current.length - 1];
            let new_city = this.closestCity(city);
            this._current.push(new_city);
        } else {
            path = this._current.slice();
            this._finished = this._count === cities.length - 1;

            if (!this._finished)
                this._current = [cities[this._count++]];
        }
    }

    closestCity(city) {
        let new_cities = this.getCities(city);
        let record = Infinity;
        let closest_city;

        for (let i = 0; i < new_cities.length; i++) {
            let d = distance(city, new_cities[i]);
            if (d < record) {
                record = d;
                closest_city = new_cities[i];
            }
        }

        return closest_city;
    }

    getCities(city) {
        let new_cities = [];

        for (let i = 0; i < cities.length; i++) {
            if (cities[i] !== city) {
                let found = false;

                for (let j = 0; j < this._current.length; j++) {
                    if (cities[i] === this._current[j]) {
                        found = true;
                        break;
                    }
                }

                if (!found) new_cities.push(cities[i]);
            }
        }

        return new_cities;
    }
}
