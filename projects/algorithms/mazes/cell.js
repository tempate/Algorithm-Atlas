class Cell {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._walls = new Array(2).fill(true);
        this._visited = false;

        this._p = createVector(this._x * block_size, this._y * block_size);
    }

    highlight() {
        noStroke();
        fill(255, 200);
        rect(this._p.x, this._p.y, block_size, block_size);
    }

    show() {
        stroke(255, 0, 0);

        if (this._walls[0] || !this._y)
            line(this._p.x, this._p.y, this._p.x + block_size, this._p.y);

        if (this._walls[1] || this._x === size - 1)
            line(this._p.x + block_size, this._p.y, this._p.x + block_size, this._p.y + block_size);

        if (this._y === size - 1)
            line(this._p.x + block_size, this._p.y + block_size, this._p.x, this._p.y + block_size);

        if (!this._x)
            line(this._p.x, this._p.y + block_size, this._p.x, this._p.y);

        if (this.visited) {
            noStroke();
            fill(0, 100);
            rect(this._p.x, this._p.y, block_size, block_size);
        }
    }
}
