class Spot {
    constructor(x, y) {
        this._x = x;
        this._y = y;

        this._f = 0;
        this._g = 0;
        this._h = 0;

        if ((x > 2 || y > 2) && (x < size - 3 || y < size - 3)) {
            this._wall = random() < 0.3;
        } else {
            this._wall = 0;
        }

        this._neighbors = [];
        this._path = [this];
        this._visited = false;
    }

    show() {
        noStroke();

        if (this._wall) {
            fill(255, 0, 0);
            ellipse(this._x * block_size + block_size / 2, this._y * block_size + block_size / 2, block_size / 2, block_size / 2);
        } else if (this._visited) {
            fill(color(150, 50));
            rect(this._x * block_size, this._y * block_size, block_size, block_size);
        }
    }

    addNeighbors(grid) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (!(x === 0 && y === 0) && this.isOnMap(this._x + x, this._y + y)) {
                    this._neighbors.push(grid[this._x + x][this._y + y]);
                }
            }
        }
    }

    isOnMap(x, y) {
        return x >= 0 && y >= 0 && x < size && y < size;
    }
}
