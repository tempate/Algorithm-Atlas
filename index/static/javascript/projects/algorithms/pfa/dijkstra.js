class Dijkstra {
    constructor() {
        this._finished = false;
        this._path = [];

        this._name = "Dijkstra";
        this._summary = "Always expands the nearest unvisited spot, so the first time it reaches the goal it has already found the shortest path.";
    }

    findPath(current, neighbor) {
        let newPath = false;
        let temp = current._f + distance(current, neighbor);

        if (unvisitedSpots.includes(neighbor)) {
            newPath = temp < neighbor._f;
        } else {
            addSorted(unvisitedSpots, neighbor);
            neighbor._visited = true;
            newPath = true;
        }

        if (newPath) {
            neighbor._f = temp;
            neighbor._path = current._path.slice();
            neighbor._path.push(neighbor);
        }
    }
}
