class DepthFirstSearch {
    constructor() {
        this._name = "Depth First";
        this._summary = "Walks to a random unvisited neighbour, knocking down the wall between them, and backtracks along a stack whenever it reaches a dead end.";
        this._finished = false;

        this._stack = [];
        this._current = grid[0];
    }

    nextMove() {
        this._current._visited = true;
        let next = this.checkNeighbors(this._current);

        if (next) {
            this._stack.push(this._current);
            this.removeWalls(this._current, next);
            this._current = next;
        } else if (this._stack.length > 0) {
            this._current = this._stack.pop();
        }

        this._current.highlight();
    }

    checkNeighbors(cell) {
        let neighbors = [
            grid[index(cell._x, cell._y - 1)],
            grid[index(cell._x + 1, cell._y)],
            grid[index(cell._x, cell._y + 1)],
            grid[index(cell._x - 1, cell._y)]
        ];

        for (let i = neighbors.length - 1; i >= 0; i--) {
            if (!neighbors[i] || neighbors[i]._visited)
                neighbors.splice(i, 1);
        }

        if (neighbors.length)
            return random(neighbors);
    }

    removeWalls(a, b) {
        let i = a._x - b._x;
        let j = a._y - b._y;

        if (i === 1) {
            b._walls[1] = false;
        } else if (i === -1) {
            a._walls[1] = false;
        }

        if (j === -1) {
            b._walls[0] = false;
        } else if (j === 1) {
            a._walls[0] = false;
        }
    }
}
