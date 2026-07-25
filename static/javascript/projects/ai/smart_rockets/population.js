class Population {
	constructor() {
		this._popSize = 25;
		this._generation = 1;

		this._rockets = [];
		for (let i = 0; i < this._popSize; i++)
			this._rockets.push(new Rocket());
	}

	evolve() {
		let pool = this.evaluate();
		this._rockets = this.selection(pool);
		this._generation++;
	}

	evaluate() {
		let maxFitness = 0;

		for (let rocket of this._rockets) {
			rocket.calculateFitness();
			if (rocket._fitness > maxFitness)
				maxFitness = rocket._fitness;
		}

		for (let rocket of this._rockets)
			rocket._fitness /= maxFitness;

		let pool = [];
		for (let rocket of this._rockets) {
			for (let i = 0; i < rocket._fitness * 100; i++)
				pool.push(rocket);
		}

		return pool;
	}

	selection(pool) {
		let rockets = [];

		for (let i = 0; i < this._popSize; i++) {
			let father = random(pool)._dna;
			let mother = random(pool)._dna;
			let child = father.crossOver(mother);
			child.mutate();
			rockets.push(new Rocket(child));
		}

		return rockets;
	}

	show() {
		for (let rocket of this._rockets) {
			rocket.update();
			rocket.show();
		}
	}
}
