class Node {
	constructor(hash, x = null, y = null, parent = null, leftChild = null, rightChild = null) {
		if (!hash) {
			throw new Error("Providing the hash is required for creating nodes");
		}
		this.hash = hash;
		this.x = x;
		this.y = y;
		this.parent = parent;
		this.leftChild = leftChild;
		this.rightChild = rightChild;
	}

	toString() {
		return this.hash.toString();
	}
}
