const k = 25;
const cityColor = "#FF4040";

let cities = new Array(k);
let path = cities.slice();

let record = Infinity;
let best = new Array(k);

// HTML variables
let select, desc, score;

let algorithms, algorithm;

function setup() {
    let canvas = createCanvas(450, 450);
    canvas.parent("canvas");
    canvas.mousePressed(reset);

    algorithms = [
        LexicographicOrder,
        SteeringBehaviours,
        Greedy,
        opt2,
        AntColony,
        SimulatedAnnealing
    ];

    randomCities();

    algorithm = new algorithms[0]();

    setupSelect();
    setupDesc();
    setupScore();
}

function setupSelect() {
    select = createSelect("");
    select.parent("select");
    select.class("custom-select");
    for (let i = 0; i < algorithms.length; i++)
        select.option(new algorithms[i]()._name);
    select.changed(reset);
}

function setupDesc() {
    desc = createP("");
    desc.parent("desc");
    desc.html(algorithm._summary);
}

function setupScore() {
    score = createP("");
    score.parent("score");
}

function randomCities() {
    for (let i = 0; i < k; i++)
        cities[i] = new City();
}

function reset() {
    randomCities();
    best = cities.slice();
    path = cities.slice();
    record = calcDistance(best);

    for (let i = 0; i < algorithms.length; i++) {
        if (select.value() == new algorithms[i]()._name)
            algorithm = new algorithms[i]();
    }

    desc.html(algorithm._summary);
}

function draw() {
    background(17);

    if (!algorithm._finished) {
        algorithm.findPath();
        updateRecord();
        drawPath(path, "#555");
    }

    if (record < Infinity)
        drawPath(best, "#CCC");

    score.html("Distance: " + int(record / 100));

    for (let city of cities)
        city.show();
}

function updateRecord() {
    let d = calcDistance(path);

    if (d < record) {
        record = d;
        best = path.slice();
    }
}

function calcDistance(path) {
    let d = 0;

    for (let i = 0; i < path.length - 1; i++)
        d += distance(path[i], path[i + 1]);
    d += distance(path[0], path[path.length - 1]);

    return d;
}

function drawPath(array, colour) {
    stroke(colour);
    strokeWeight(2);

    for (let i = 0; i < array.length - 1; i++)
        line(array[i]._x, array[i]._y, array[i+1]._x, array[i+1]._y);
    line(array[0]._x, array[0]._y, array[array.length - 1]._x, array[array.length - 1]._y);
}

function distance(a, b) {
    return Math.pow(b._x - a._x, 2) + Math.pow(b._y - a._y, 2);
}

function swap(a, i, j) {
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

class City {
    constructor() {
        this._x = random(5, width - 5);
        this._y = random(5, height - 5);
    }

    show() {
        fill(cityColor);
        noStroke();
        ellipse(this._x, this._y, 10, 10);
    }
}
