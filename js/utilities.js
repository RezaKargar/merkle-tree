async function digestMessage(data) {
	const dataUint8 = new TextEncoder().encode(data); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest("SHA-256", dataUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join(""); // convert bytes to hex string
	return hashHex;
	// return data;
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