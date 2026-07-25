class Rocket {
	constructor(dna) {
		this._dna = dna ? dna : new DNA();

		this._size = 20;
		this._success = false;
		this._crashed = false;
		this._time = 0;

		this._fitness = 0;

		this._p = createVector(width / 2, height - this._size * 2);
		this._v = createVector();
		this._a = createVector();
	}

	applyForce(force) {
		this._a.add(force);
	}

	calculateFitness() {
		let distance = dist(this._p.x, this._p.y, target._p.x, target._p.y);
		this._fitness = width - distance;

		if (this._success) {
			this._fitness *= 10;
		} else if (this._crashed) {
			this._fitness /= 5;
		}
	}

	update() {
		if (!this._crashed)
			this.checkCrashed();

		this.checkSuccess();

		if (!this._success && !this._crashed) {
			this.applyForce(this._dna._genes[this._time++]);
			this._v.add(this._a);
			this._p.add(this._v);
			this._a.mult(0);
			this._v.limit(4);
    	}
	}

	checkSuccess() {
		let distance = dist(this._p.x, this._p.y, target._p.x, target._p.y);

		if (distance < target._size) {
			this._success = true;
			this._p.x = target._p.x;
			this._p.y = target._p.y;
		}
	}

	checkCrashed() {
		this._crashed = (
			this._p.x >= width - this._size / 1.5 ||
			this._p.x <= 0 + this._size / 1.5 ||
			this._p.y >= height - this._size / 1.5 ||
			this._p.y <= 0 + this._size / 1.5
		);

		if (!this._crashed) {
			for (let obstacle of obstacles) {
				this._crashed = (
					this._p.x >= obstacle._p.x - this._size / 2 &&
					this._p.x <= obstacle._p.x + obstacle._width + this._size / 2 &&
					this._p.y <= obstacle._p.y + obstacle._height / 2 + this._size / 1.5 &&
					this._p.y >= obstacle._p.y - obstacle._height / 2 - this._size / 1.5
				)
			}
		}
	}

	show() {
		strokeWeight(1);
		noStroke();
		fill(255, 155);
		ellipse(this._p.x, this._p.y, this._size, this._size);
	}
}
