function hashWithSHA256(data) {
	var hash = CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(data));
    var sha256 = hash.toString(CryptoJS.enc.Hex)
	return sha256;
}

function levelOrderTraversal(tree) {
	if (!tree.root)
		throw new Error("Tree is not initialized!. root is not set.");

	let queue = [tree.root];

	let result = [];
	while (queue.length > 0) {
		let currentLevelNodes = [];

		let countOfCurrentLevelNodes = queue.length;

		while (countOfCurrentLevelNodes > 0) {
			// Poping the first item of the queue
			let temp = queue[0];
			queue = queue.slice(1);

			// Visiting the node,
			// It means adding the node to currentLevelNodes
			currentLevelNodes.push(temp);

			if (temp.leftChild && !(temp.leftChild instanceof Leaf)) {
				queue.push(temp.leftChild);
			}

			if (temp.rightChild && !(temp.rightChild instanceof Leaf)) {
				queue.push(temp.rightChild);
			}
			countOfCurrentLevelNodes -= 1;
		}

		result.push(currentLevelNodes);
	}

	return result;
}

function reverseLevelOrderTraversal(tree){
	let nodesInLevelOrderTraversal = levelOrderTraversal(tree);
	return nodesInLevelOrderTraversal.reverse();
}

function readFileAsync(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
		resolve(reader.result);
		};

		reader.onerror = reject;

		reader.readAsBinaryString(file);
	})
}