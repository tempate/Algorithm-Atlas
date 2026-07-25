const size = 50;
let block_size; // width / size

let start, end;

let grid = [];

let unvisitedSpots = [];

let select, desc;

let algorithms, algorithm;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent("canvas");
    canvas.mousePressed(reset);

    block_size = int(width / size);

    setupGrid();

    start = grid[0][0];
    end = grid[grid.length - 1][grid.length - 1];

    algorithms = [
        Dijkstra,
        AStar
    ];

    algorithm = new algorithms[0]();

    setupSelect();
    setupDesc();

    unvisitedSpots.push(start);
}

function setupGrid() {
    for (let i = 0; i < size; i++) {
        grid[i] = new Array(size);
        for (let j = 0; j < size; j++)
            grid[i][j] = new Spot(i, j);
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++)
            grid[i][j].addNeighbors(grid);
    }
}

function setupSelect() {
    select = createSelect("");
    select.parent("select");
    select.class("custom-select");
    select.changed(reset);

    for (let i = 0; i < algorithms.length; i++)
        select.option(new algorithms[i]()._name);
}

function setupDesc() {
    desc = createP("");
    desc.parent("desc");
    desc.html(algorithm._summary);
}

function reset() {
    setupGrid();

    for (let i = 0; i < algorithms.length; i++) {
        algorithm = new algorithms[i]();
        if (select.value() === algorithm._name)
            break;
    }

    start = grid[0][0];
    end = grid[grid.length - 1][grid.length - 1];

    unvisitedSpots = [start];
}

function draw() {
    background(17);

    if (!algorithm._finished) {
        let current = best(unvisitedSpots);

        for (let neighbor of current._neighbors) {
            if (!neighbor._visited && !neighbor._wall)
                algorithm.findPath(current, neighbor);
        }

        algorithm._path = current._path.slice();
        algorithm._finished = current === end;
    }

    drawPath(algorithm._path);

    for (let row of grid) {
        for (let spot of row)
            spot.show();
    }
}

function best(array) {
    let index;

    // By looping backwards it will have to change index least often
    for (let i = array.length - 1, record = Infinity; i >= 0; i--) {
        if (array[i]._f < record) {
            record = array[i]._f;
            index = i;
        }
    }

    // Make spot a new element from the array
    let spot = array.splice(index, 1)[0];

    return spot;
}

function drawPath(path) {
    noFill();
    stroke(250, 180);
    strokeWeight(block_size / 4);
    beginShape();

    for (let i = 0; i < path.length; i++)
        vertex(path[i]._x * block_size + block_size / 2, path[i]._y * block_size + block_size / 2);

    endShape();
}

function calcDistance(path) {
    let d = 0;

    for (let i = 0; i < path.length - 1; i++)
        d += distance(path[i], path[i + 1]);

    return d;
}

function distance(a, b) {
    return sqrt(pow(b._x - a._x, 2) + pow(b._y - a._y, 2));
}


function addSorted(array, spot) {
    for (let i = 0; i < array.length; i++) {
        if (spot._f > array[i]._f) {
            array.splice(i - 1, 0, spot);
            return;
        }
    }

    array.push(spot);
}
