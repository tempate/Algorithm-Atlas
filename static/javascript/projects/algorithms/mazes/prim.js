class Prim {
    constructor() {
        this._name = "Prim's";
        this._summary = "Grows the maze outwards from a single cell, each step opening a random wall on the frontier between the maze and the cells outside it.";
        this._finished = false;

        this._walls = [];
        this._current = grid[0];
    }

    nextMove() {
        this._current._visited = true;
        this._current = this.removeWall();
        this._finished = !this._walls.length;
    }

    removeWall() {
        let neighbors = [
            grid[index(this._current._x, this._current._y - 1)],
            grid[index(this._current._x + 1, this._current._y)],
            grid[index(this._current._x, this._current._y + 1)],
            grid[index(this._current._x - 1, this._current._y)]
        ];

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (neighbor && !neighbor._visited && this._walls.indexOf(neighbor) === -1) {
                this._walls.push(neighbor);
                if (i < 2) {
                    this._current._walls[i] = false;
                } else {
                    neighbor._walls[i - 2] = false;
                }
            }
        }

        let wallIndex = int(random(this._walls.length));
        return this._walls.splice(wallIndex, 1)[0]
    }
}
