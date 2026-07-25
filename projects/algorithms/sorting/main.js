const k = 500;
const colour = "#CCC";

let numbers = [];
let w;

let select, desc, slider;

let algorithms, algorithm;

function setup() {
    let canvas = createCanvas(450, 450);
    canvas.parent("canvas");
    canvas.mousePressed(reset);

    w = width / k;
    randomNumbers();

    slider = createSlider(1,60,60,1);
    slider.parent("slider");

    algorithms = [
        Selection,
        Insertion,
        Merge,
        Heap,
        Bubble,
        Shell,
        Comb,
        Radix
    ];

    algorithm = new algorithms[0]();

    setupSelect();
    setupDesc();
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
    desc.class("description");
    desc.parent("desc");
    desc.html(algorithm._summary);
}

function draw() {
    background(17);
    frameRate(slider.value());

    if (!algorithm._finish)
        algorithm.order();

    noStroke();
    for (let i = 0; i < numbers.length; i++) {
        fill(colour);
        rect(i * w + w / 2, height, 2, - numbers[i] * height);
    }
}

function reset() {
    randomNumbers();

    for (let i = 0; i < algorithms.length; i++) {
        if (select.value() == new algorithms[i]()._name)
            algorithm = new algorithms[i]();
    }

    desc.html(algorithm._summary);
}

function randomNumbers() {
    for (let i = 0; i < k; i++)
        numbers[i] = Math.random();
}

function swap(array, a, b) {
    let temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}
