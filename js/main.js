// Create canvas and append it to body
const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
body.appendChild(canvas);

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

let width = 100;
let height = 30;

const countOfLeavesToResize = 8;

let zoomFactor = 1;

let previousLeavesLength;

let tree = createAnInitialTree();
init();

function init() {
	let leaves = [
		new Leaf("This is"),
		new Leaf("a dummy,"),
		new Leaf("useless,"),
		new Leaf("nothingless text."),
		new Leaf("Made "),
		new Leaf("by"),
		new Leaf("Reza"),
		new Leaf("Kargar")
	];

	tree = new MerkleTree(...leaves);

	render();
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let lengthOfLeaves = tree.leafs.length;
	if (lengthOfLeaves > countOfLeavesToResize && lengthOfLeaves != previousLeavesLength) {
		zoomFactor -= (lengthOfLeaves / countOfLeavesToResize + (lengthOfLeaves % countOfLeavesToResize)) / countOfLeavesToResize;
		zoomFactor = Math.abs(zoomFactor);

		width *= zoomFactor;
		height *= zoomFactor;

		previousLeavesLength = lengthOfLeaves;
	}

	drawTree(tree);
	requestAnimationFrame(render);
}

function createAnInitialTree() {
	return new MerkleTree();
}

function drawTree(tree) {
	let x = 50;
	let y = canvas.height - 160;

	if (!tree.root) return;

	let nodesInLevelForm = reverseLevelOrderTraversal(tree);

	// Draw the deepest level
	var nodesOfDeepestLevel = nodesInLevelForm[0];
	nodesOfDeepestLevel.forEach((node) => {
		node.x = x;
		node.y = y;

		draw(node.hash, x, y, width, height);

		x += width * 1.5;
	});

	x = 50;
	y += 80;
	tree.leafs.forEach((leaf, index) => {
		let nodeOfLeaf = nodesOfDeepestLevel[index];
		if (!nodeOfLeaf) return;
		leaf.x = nodeOfLeaf.x;
		leaf.y = nodeOfLeaf.y + 80;
		draw(leaf.data, leaf.x, leaf.y, width, height);
		drawLineBetween2Nodes(nodeOfLeaf, leaf);
	});

	nodesInLevelForm.forEach((nodesOfLevel, levelIndex) => {
		if (levelIndex === 0) return;

		nodesOfLevel.forEach((node, nodeIndexInLevel) => {
			let leftChild = node.leftChild;
			let rightChild = node.rightChild;

			let x, y;

			if (!leftChild || !rightChild) {
				let siblingNode = nodesOfLevel[nodeIndexInLevel - 1];
				let otherSiblingNode = nodesOfLevel[nodeIndexInLevel - 2];
				x = siblingNode.x + (siblingNode.x - otherSiblingNode.x);
				y = siblingNode.y;
			} else {
				x = (leftChild.x + rightChild.x) / 2;
				y = leftChild.y - 80;
			}

			node.x = x;
			node.y = y;

			draw(node.hash, x, y, width, height);
			drawLinesToChildren(node);
		});
	});

	// nodesInLevelForm.forEach((nodesOfLevel, levelIndex) => {
	// 	let tempXs = [];
	// 	nodesOfLevel.forEach((node, nodeIndexInLevel) => {
	// 		if (levelIndex > 0) {
	// 			let previousLevelXs = xs[levelIndex - 1];
	// 			let rightChildIndex = (previousLevelXs.length / 2) - 1;
	// 			let leftChildIndex = rightChildIndex - 1;

	// 			x =
	// 				previousLevelXs[leftChildIndex + nodeIndexInLevel] +
	// 				previousLevelXs[rightChildIndex + nodeIndexInLevel] +
	// 				width / 2;
	// 		}
	// 		drawLeaf(node.hash, x, y, width, height);
	// 		tempXs.push(x);

	// 		x += width * 1.5;
	// 	});
	// 	y -= 80;
	// 	xs.push(tempXs);
	// });

	// let maxIndexOfLevelI = (nodesInReverseLevelOrderTraversal.length + 1) / 2;
	// let maxNumsOfLevels =
	// 	(nodesInReverseLevelOrderTraversal.length + 1) / 4 + 1;
	// let currentLevel = maxNumsOfLevels;

	// let leftPadding = width / 2 ;
	// nodesInReverseLevelOrderTraversal.forEach((node, i) => {
	// 	drawLeaf(node.hash, x, y, width, height);
	// 	x += 50 + width ;
	// 	// leftPadding += width;
	// 	if (i + 1 == maxIndexOfLevelI) {
	// 		maxIndexOfLevelI += maxIndexOfLevelI / 2;
	// 		currentLevel -= 1;
	// 		y -= 80 + height;
	// 		x = width -20 + (maxNumsOfLevels - currentLevel) * leftPadding;
	// 	}
	// });
}

function draw(text, x, y, width, height) {
	ctx.fillStyle = "white";
	ctx.fillRect(x + 2, y + 2, width - 2, height - 2);
	ctx.strokeRect(x, y, width, height);
	ctx.fillStyle = "black";
	ctx.font = "1.2em serif";
	if (text.length > 10) text = text.slice(0, 8) + "...";
	ctx.fillText(text, x, y + height - height / 3);
}

function drawLine(xA, yA, xB, yB) {
	ctx.beginPath();
	ctx.moveTo(xA, yA);
	ctx.lineTo(xB, yB);
	ctx.stroke();
}

function drawLineBetween2Nodes(nodeA, nodeB) {
	if (!nodeA || !nodeB)
		throw new Error(
			"For drawing a line between two nodes, providing the both of them is required"
		);

	let xA = nodeA.x + width / 2;
	let yA = nodeA.y + height;

	let xB = nodeB.x + width / 2;
	let yB = nodeB.y;

	drawLine(xA, yA, xB, yB);
}

function drawLinesToChildren(node) {
	if (node.leftChild) drawLineBetween2Nodes(node, node.leftChild);

	if (node.rightChild) drawLineBetween2Nodes(node, node.rightChild);
}
