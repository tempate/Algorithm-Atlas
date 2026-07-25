class AStar {
    constructor() {
        this._finished = false;
        this._path = [];

        this._name = "A Star";
        this._summary = "Dijkstra plus an estimate of the distance still to go, which pulls the search towards the goal instead of spreading out evenly.";
    }

    findPath(current, neighbor) {
        let newPath = false;
        let temp = current._g + distance(neighbor, current);

        if (unvisitedSpots.includes(neighbor)) {
            newPath = temp < neighbor._g;
        } else {
            addSorted(unvisitedSpots, neighbor);
            neighbor._visited = true;
            newPath = true;
        }

        if (newPath) {
            neighbor._g = temp;
            neighbor._h = distance(neighbor, end);
            neighbor._f = neighbor._g + neighbor._h;
            neighbor._path = current._path.slice();
            neighbor._path.push(neighbor);
        }
    }
}
