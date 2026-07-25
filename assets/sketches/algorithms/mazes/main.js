const size = 30;
let block_size;

let grid = [];

let algorithms, algorithm;

let select, desc;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent("canvas");
    canvas.mousePressed(reset);

    block_size = (width - 1) / size;

    algorithms = [
        DepthFirstSearch,
        Kruskal,
        Prim
    ];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            grid.push(new Cell(x, y));
        }
    }

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

function reset() {
    grid = [];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            grid.push(new Cell(x, y));
        }
    }

    for (let i = 0; i < algorithms.length; i++) {
        if (select.value() == new algorithms[i]()._name)
            algorithm = new algorithms[i]();
    }


}

function draw() {
    background(17);

    if (!algorithm._finished)
        algorithm.nextMove();

    for (let cell of grid)
        cell.show();
}

function index(x, y) {
    if (x < 0 || y < 0 || x > size - 1 || y > size - 1)
        return false;
    return x + y * size;
}
