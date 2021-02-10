class MerkleTree {
	constructor(...leafs) {
        let isAnyNoneLeafInLeafs = leafs.filter(leaf => !(leaf instanceof Leaf)).length > 0;
        if(isAnyNoneLeafInLeafs)
            throw new Error("Tree leafs all must be instances of Leaf class");

		this.leafs = [];
		this.leafs.push(...leafs);
        
        this.buildTree().then(root => {
            this.root = root;
        });
	}

    addLeaf(leaf) {
        if(!(leaf instanceof Leaf)){
            throw new Error("leaf must be an instance of Leaf class");
        }
        this.leafs.push(leaf);
        
        this.buildTree().then(root => {
            this.root = root;
        });
    }

	async buildLeafNodes() {
		let leafNodes = [];

		for (let leaf of this.leafs) {
			let hashOfLeafsData = await this.hash(leaf.data);

			let leafNode = new Node(hashOfLeafsData);
            leafNode.leftChild = leaf;

            leafNodes.push(leafNode);

            leaf.parent = leafNode;
		}
		return leafNodes;
	}

	async buildTree() {
        // If leafs' count is odd, dupplicate the last leaf
		if (this.leafs.length % 2 != 0) {
			this.leafs.push(leafs[leafs.length - 1]);
		}

		let leafNodes = await this.buildLeafNodes();
        
        let nodesThatHasNotProcessed = [...leafNodes];

        // Tree has more than one node, the only node that tree
        // should have is the root node
        while(nodesThatHasNotProcessed.length > 1){

            let leftChild = nodesThatHasNotProcessed[0]
            let rightChild = nodesThatHasNotProcessed[1]

			let dataOfParentNodeThatMustBeHashed = leftChild.hash + rightChild.hash;
			let hashOfParentNode = await this.hash(dataOfParentNodeThatMustBeHashed);

			let parentNode = new Node(hashOfParentNode);
			parentNode.leftChild = leftChild;
			parentNode.rightChild = rightChild;

            leftChild.parent = parentNode;
            rightChild.parent = parentNode;
            
            nodesThatHasNotProcessed.push(parentNode);

            nodesThatHasNotProcessed = nodesThatHasNotProcessed.slice(2);
		}

        return nodesThatHasNotProcessed[0];
	}

    async hash(data){
        const digestHex = await digestMessage(data);
        return digestHex;
    }

	toString() {
		return this.root.toString();
	}
}