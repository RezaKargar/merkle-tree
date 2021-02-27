class Leaf {
    constructor(data, x = null, y = null, parent = null) {
        this.data = data;
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    toString() {
        return this.data.toString();
    }
}