let counter;

class SteeringBehaviours {
    constructor(generation) {
        this._distance = Infinity;
        this._current = [];
        this._fitness = [];
        this._pool = [];
        this._mutation = 0.05;

        this._population = new Array(k * 100);

        // Set up random population
        for (let i = 0; i < this._population.length; i++)
            this._population[i] = shuffle(cities);

        this._generation = generation ? generation : 0;

        this._name = "Steering Behaviours";
        this._summary = "Breeds a population of routes, favouring the shorter ones as parents and mutating the offspring, one generation at a time.";
    }

    setupCounter() {
        if (this._generation === 1) {
            counter = createP("");
            counter.class("row justify-content-center align-self-center");
        }
        counter.html(`Generation: ${this._generation}`);
    }

    findPath() {
        algorithm = new SteeringBehaviours(this._generation + 1);
        cities = algorithm.evolve();
        algorithm.setupCounter();

        path = cities.slice();
    }

    evolve() {
        this.calculateFitness();
        this.normalizeFitness();
        this.nextGeneration();
        return this._current;
    }

    calculateFitness() {
        for (let path of this._population) {
            let d = calcDistance(path);

            if (d < record) {
                record = d;
                best = path;
            }

            if (d < this._distance) {
                this._distance = d;
                this._current = path;
            }

            this._fitness.push(d);
        }
    }

    normalizeFitness() {
        for (let i = 0; i < this._fitness.length; i++) {
            this._fitness[i] = this._distance / this._fitness[i];

            for (let j = 0; j < this._fitness[i] * 50; j++)
                this._pool.push(this._population[i]);
        }
    }

    nextGeneration() {
        let newPopulation = [];

        for (let i in this._population) {
            let child = this.crossover(random(this._pool), random(this._pool));

            this.mutate(child, this._mutation);
            newPopulation[i] = child;
        }

        this._population = newPopulation.slice();
    }

    crossover(mom, dad) {
        const start = int(random(mom.length));
        const end = int(random(start + 1, mom.length));
        let neworder = mom.slice(start, end);

        for (let city of dad) {
            if (!neworder.includes(city))
                neworder.push(city);
        }

        return neworder;
    }

    mutate(order, rate) {
        for (let i = 0; i < k; i++) {
            if (random() < rate) {
                let a = int(Math.random() * order.length);
                let b = (a + 1) % k;
                swap(order, a, b);
            }
        }
    }
}
