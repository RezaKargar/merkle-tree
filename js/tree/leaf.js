class Leaf {
    constructor(data, parent = null) {
        this.data = data;
        this.parent = parent;
    }

    toString() {
        return this.data.toString();
    }
}