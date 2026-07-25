let points = [];

let select, desc;

let algorithms, algorithm;

function setup() {
    let canvas = createCanvas(450, 450);
    canvas.parent("canvas");
    // Scoped to the canvas: as a global handler this caught clicks anywhere on
    // the page, including the algorithm dropdown.
    canvas.mousePressed(addPoint);

    algorithms = [
        OrdinaryLeastSquares,
        GradientDescent
    ]

    algorithm = new algorithms[0]();

    setupSelect();
    setupDesc();
}

function setupSelect() {
    select = createSelect("");
    select.parent("select");

    for (let i = 0; i < algorithms.length; i++)
        select.option(new algorithms[i]()._name);

    select.changed(reset);
}

function setupDesc() {
    desc = createP("");
    desc.parent("desc");
    desc.id("description");
    desc.html(algorithm._summary);
}

function reset() {
    for (let i = 0; i < algorithms.length; i++) {
        if (select.value() == new algorithms[i]()._name)
            algorithm = new algorithms[i]();
    }

    desc.html(algorithm._summary);
}

function draw() {
    background(17);

    for (let point of points) {
        let x = map(point.x, 0, 1, 0, width);
        let y = map(point.y, 0, 1, height, 0);

        noStroke();
        fill(255, 0, 0);
        ellipse(x, y, 8, 8);
    }

    if (points.length > 1) {
        algorithm.findLine();
        drawLine(algorithm._m, algorithm._b);
    }
}

function drawLine(m, b) {
    let x1 = 0;
    let y1 = m * x1 + b;

    let x2 = 1;
    let y2 = m * x2 + b;

    x1 = map(x1, 0, 1, 0, width);
    y1 = map(y1, 0, 1, height, 0);
    x2 = map(x2, 0, 1, 0, width);
    y2 = map(y2, 0, 1, height, 0);

    stroke(255, 155);
    line(x1, y1, x2, y2);
}

class OrdinaryLeastSquares {
    constructor() {
        this._name = "Ordinary Least Squares";
        this._summary = "Solves for the line that minimises the total squared error in one step, straight from the means of the points.";

        this._m = 0;
        this._b = 0;
    }

    findLine() {
        let x_sum = 0;
        let y_sum = 0;

        for (let point of points) {
            x_sum += point.x;
            y_sum += point.y;
        }

        let x_avarage = x_sum / points.length;
        let y_avarage = y_sum / points.length;

        let num = 0, den = 0;

        for (let point of points) {
            num += (point.x - x_avarage) * (point.y - y_avarage);
            den += pow((point.x - x_avarage), 2);
        }

        this._m = num / den;
        this._b = y_avarage - this._m * x_avarage;
    }
}

class GradientDescent {
    constructor() {
        this._name = "Gradient Descent";
        this._summary = "Starts from a flat line and nudges its slope and intercept a little against the error of each point, over and over.";

        this._learning_rate = 0.1;

        this._m = 0;
        this._b = 0;
    }

    findLine() {
        for (let point of points) {
            const guess = this._m * point.x + this._b;
            const error = point.y - guess;

            this._m += error * point.x * this._learning_rate;
            this._b += error * this._learning_rate;
        }
    }
}

function addPoint() {
    let x = map(mouseX, 0, width, 0, 1);
    let y = map(mouseY, 0, height, 1, 0);

    if (x >= 0 && x <= 1 && y >= 0 && y <= 1)
        points.push(createVector(x, y));
}
