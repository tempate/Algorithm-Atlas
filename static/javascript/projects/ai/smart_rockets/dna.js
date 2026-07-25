class DNA {
	constructor(genes) {
		this._genes = genes ? genes : this.createGenes();
	}

	createGenes() {
		let genes = [];

		for (let i = 0; i < lifeSpan; i++) {
			genes.push(p5.Vector.random2D());
			genes[i].setMag(maxForce);
		}

		return genes;
	}

	crossOver(partner) {
		let newGenes = [];
		let split = int(random(this._genes.length));

		for (let i = 0; i < split; i++)
			newGenes[i] = this._genes[i];

		for (let i = split + 1; i < this._genes.length; i++)
			newGenes[i] = partner._genes[i];

		return new DNA(newGenes);
	}

	mutate() {
		for (let i = 0; i < this._genes.length; i++) {
			if (random() < mutationRate) {
				this._genes[i] = p5.Vector.random2D();
				this._genes[i].setMag(maxForce);
			}
		}
	}
}
