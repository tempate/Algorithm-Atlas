class Kruskal {
    constructor() {
        this._name = "Kruskal's";
        this._summary = "Starts with every cell in its own set and removes walls between cells that belong to different sets, merging them until one set remains.";
        this._finished = false;

        this._cells = grid.slice();

        for (let i = 0; i < this._cells.length; i++) {
            this._cells[i]._id = i;
            this._cells[i]._set = [this._cells[i]];
        }
    }

    nextMove() {
        let cellIndex = this.getRandomTrueElement(this._cells);
        this._finished = cellIndex === -1

        let cell = this._cells[cellIndex];
        let wallIndex = this.getRandomTrueElement(cell._walls);

        if (wallIndex === -1)
            this._cells[cellIndex] = 0;

        let neighbor = this.getNeighborForWall(cell, wallIndex);

        if (neighbor && cell._id !== neighbor._id) {
            let newSet = cell._set.concat(neighbor._set);
            for (let partner of neighbor._set)
                partner._id = cell._id;

            for (let partner of newSet)
                partner._set = newSet;

            cell._walls[wallIndex] = false;
        }
    }

    getRandomTrueElement(array) {
        let newArray = [];

        for (let i = 0; i < array.length; i++) {
            if (array[i])
                newArray.push(i);
        }

        return newArray.length ? random(newArray) : -1;
    }

    getNeighborForWall(cell, wallIndex) {
        switch (wallIndex) {
            case 0:
                return this._cells[index(cell._x, cell._y - 1)];
            case 1:
                return this._cells[index(cell._x + 1, cell._y)];
            default:
                return 0;
        }
    }
}
