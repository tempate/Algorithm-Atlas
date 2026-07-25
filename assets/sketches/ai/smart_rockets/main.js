const lifeSpan = 300;
const maxForce = 0.4;
const mutationRate = 0.01;

let population;
let target;
let obstacles;

let gen;

function setup() {
	let canvas = createCanvas(600, 600);
    canvas.parent("canvas");
    canvas.mousePressed(reset);

	population = new Population();
	target = new Target();
	obstacles = [];

	obstacles.push(new Obstacle(width / 2 - 175, height / 2 - 10, 350, 3));

	gen = createP("");
	gen.parent("gen");
}

function reset() {
	population = new Population();
}

function draw() {
	background(17);

	if (frameCount % lifeSpan === 0)
		population.evolve();

	population.show();
	target.show();

	gen.html("Generation: " + population._generation);

	for (let obstacle of obstacles)
		obstacle.show();
}

class Target {
	constructor() {
		this._size = 40;
		this._p = createVector(width / 2, this._size * 2);
	}

	show() {
		strokeWeight(3);
		noFill();
		stroke(0, 255, 0);
		ellipse(this._p.x, this._p.y, this._size, this._size);
	}
}

class Obstacle {
	constructor(x, y, width, height) {
		this._width = width;
		this._height = height;
		this._p = createVector(x, y);
	}

	show() {
		stroke(200, 0, 0);
		fill(200, 0, 0);
		rect(this._p.x, this._p.y, this._width, this._height);
	}
}
