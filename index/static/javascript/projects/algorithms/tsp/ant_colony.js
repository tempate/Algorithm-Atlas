class AntColony {
    constructor() {
        this._finished = false;

        this._name = "Ant Colony";
        this._summary = "Ants wander between cities and leave pheromone along the way, more of it on shorter routes, which biases where later ants choose to walk.";
    }

    findPath() {
        let shortest = Infinity;
        let bestAnt;

        for (let ant, d, k = 0; k < 10; k++) {
            ant = new Ant();
            d = ant.generateRoute();

            if (d < shortest) {
                shortest = d;
                bestAnt = ant;
            }
        }

        // Reinforce shortest
        bestAnt.reinforcePath(shortest);
        path = bestAnt._path.slice();
    }
}

class Ant {
    constructor() {
        this._path = [cities[0]];
        this._possible = cities.slice();
        this._possible.splice(0, 1);
        this._pool = [];
        this.modifyCities();
    }

    modifyCities() {
        for (let i = 0; i < k; i++) {
            cities[i]._position = i;
            cities[i]._roads = new Array(k).fill(1);
        }
    }

    generateRoute() {
        while (this._path.length != cities.length)
            this.chooseCity();
        return calcDistance(this._path);
    }

    chooseCity() {
        this._pool = [];
        let lastCity = this._path[this._path.length - 1];

        let most_probable = 0;
        // Generate a pool based on the probability on it happening
        for (let i = 0; i < this._possible.length; i++) {
            let city = this._possible[i];
            let probability = lastCity._roads[city._position] / distance(lastCity, city) * 10;
            do {
                this._pool.push(city);
                probability--;
            } while (probability > 0);
        }

        // Choose a city depending on the probability
        let index = int(Math.random() * this._pool.length);
        let new_city = this._pool[index];

        // Add weight to the path you go through
        this.addWeight(lastCity, new_city, 1);
        this._path.push(new_city);

        // Remove city from the possible
        for (let i = this._possible.length - 1; i >= 0; i--) {
            if (this._possible[i]._position == new_city._position) {
                this._possible.splice(i, 1);
                break;
            }
        }
    }

    reinforcePath(length) {
        const weight = length / max * 2;
        for (let i = 0; i < this._path.length - 1; i++)
            this.addWeight(this._path[i], this._path[i+1], weight);
    }

    addWeight(cityA, cityB, weight) {
        cityA._roads[cityB._position] += weight;
        cityB._roads[cityA._position] += weight;
    }
}
