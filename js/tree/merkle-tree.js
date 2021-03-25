class MerkleTree {
	constructor(...leafs) {
		let isAnyNoneLeafInLeafs =
			leafs.filter((leaf) => !(leaf instanceof Leaf)).length > 0;
		if (isAnyNoneLeafInLeafs)
			throw new Error("Tree leafs all must be instances of Leaf class");

		this.leafs = [...leafs];
	}

	addLeaf(leaf) {
		if (!(leaf instanceof Leaf)) {
			throw new Error("leaf must be an instance of Leaf class");
		}
		this.leafs.push(leaf);
	}

	buildLeafNodes() {
		let leafNodes = [];

		for (let leaf of this.leafs) {
			let hashOfLeafsData = hashWithSHA256(leaf.data);

			let leafNode = new Node(hashOfLeafsData);
			leafNode.leftChild = leaf;

			leafNodes.push(leafNode);

			leaf.parent = leafNode;
		}
		return leafNodes;
	}

	async buildTree() {
		this.root = await this.#buildTree();
		saveLeafsToLocalStorage(this);
		return this;
	}

	async #buildTree() {
		let leafNodes = this.buildLeafNodes();

		let nodesThatHasNotProcessed = [...leafNodes];

		if (nodesThatHasNotProcessed.length == 1)
			return nodesThatHasNotProcessed[0];

		let aa = await this.a(nodesThatHasNotProcessed);

		while (aa.length > 1) {
			aa = await this.a(aa);
		}
		return aa[0];
	}

	async a(nodesThatHasNotProcessed) {
		let result = [];
		while (nodesThatHasNotProcessed.length > 1) {
			let leftChild = nodesThatHasNotProcessed[0];
			let rightChild = nodesThatHasNotProcessed[1];

			let dataOfParentNodeThatMustBeHashed =
				leftChild.hash + rightChild.hash;
			let hashOfParentNode = hashWithSHA256(
				dataOfParentNodeThatMustBeHashed
			);

			let parentNode = new Node(hashOfParentNode);
			parentNode.leftChild = leftChild;
			parentNode.rightChild = rightChild;

			leftChild.parent = parentNode;
			rightChild.parent = parentNode;

			result.push(parentNode);

			nodesThatHasNotProcessed = nodesThatHasNotProcessed.slice(2);

			if (nodesThatHasNotProcessed.length % 2 != 0) {
				let lastNode =
					nodesThatHasNotProcessed[
						nodesThatHasNotProcessed.length - 1
					];
				let dupplicatedNode = new Node(lastNode.hash);
				nodesThatHasNotProcessed.push(dupplicatedNode);
			}
		}

		return result;
	}

	toString() {
		return this.root.toString();
	}
}
