class Heap {
    constructor() {
        this._finish = false;
        this._heap = new HeapTree();
        this._j = 0;

        this._name = "Heap Sort";
        this._summary = "Same approach as Selection Sort but using a Heap.";
    }

    order() {
        if (this._heap._array.length === 0) {
            for (var i = 0; i < numbers.length; i++)
                this._heap.insert(numbers[i]);
        } else if (this._j < k) {
            numbers[this._j++] = this._heap.extract();
        } else {
            this._finish = true;
        }
    }
}

class HeapTree {
    constructor() {
        this._array = [];
    }

    insert(number) {
        this._array.push(number);
        this.heapifyUp();
    }

    extract() {
        let root = this._array[0];
        this._array[0] = this._array.pop();
        this.heapifyDown();
        return root;
    }

    heapifyUp() {
        let index = this._array.length - 1;

        while (this.hasRelative(index, 0) && this.getRelative(index, 0) > this._array[index]) {
            swap(this._array, this.getIndex(index, 0), index);
            index = this.getIndex(index, 0);
        }
    }

    heapifyDown() {
        let index = 0;

        while (this.hasRelative(index, 1)) {
            let smaller = this.getIndex(index, 1);

            if (this.hasRelative(index, 2) && this.getRelative(index, 2) < this.getRelative(index, 1))
                smaller = this.getIndex(index, 2);

            if (this._array[index] > this._array[smaller])
                swap(this._array, index, smaller);

            index = smaller;
        }
    }

    /*
    0: Father
    1: Left child
    2: Right child
    */
    getIndex(index, id) {
        if (id === 1 || id === 2) {
            return index * 2 + id;
        } else {
            return Math.floor((index - 1) / 2);
        }
    }

    hasRelative(index, id) {
        let value = this.getIndex(index, id);
        return (id === 0) ? value >= 0 : value < k;
    }

    getRelative(index, id) {
        return this._array[this.getIndex(index, id)];
    }
}
