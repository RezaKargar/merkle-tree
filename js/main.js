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

let positions = [];

let maxX = 0;

const initialWidth = 100;
const initialHeight = 30;
const distanceBetweenNodeLevels = 80;

let width = initialWidth;
let height = initialHeight;

let countOfLeavesToResizeWidth = 8;

let countOfCharactersToShow = 10;

let zoomFactor = 1;

let previousLeavesLength;

let tree = createAnInitialTree();
init();

function init() {
	tree = new MerkleTree(...[]);
	render();
}

function render() {
	positions = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let lengthOfLeaves = tree.leafs.length;

	if (maxX >= canvas.width - 30) {
		width *= .9;
		height = initialHeight / (lengthOfLeaves / 20);

		previousLeavesLength = lengthOfLeaves;

		countOfCharactersToShow = width / 10;
	}
	
	maxX = 0;

	drawTree(tree);
	requestAnimationFrame(render);
}

function createAnInitialTree() {
	return new MerkleTree();
}

function drawTree(tree) {
	let x = 50;
	let y = canvas.height - 250;

	if (!tree.root) return;

	let nodesInLevelForm = reverseLevelOrderTraversal(tree);

	// Draw the deepest level
	var nodesOfDeepestLevel = nodesInLevelForm[0];
	nodesOfDeepestLevel.forEach((node) => {
		node.x = x;
		node.y = y;

		draw(node.hash, x, y, width, height);

		positions.push({X: x, Y: y, Node: node});

		x += width * 1.5;
	});

	x = 50;
	y += distanceBetweenNodeLevels;
	tree.leafs.forEach((leaf, index) => {
		let nodeOfLeaf = nodesOfDeepestLevel[index];
		if (!nodeOfLeaf) return;
		leaf.x = nodeOfLeaf.x;
		leaf.y = nodeOfLeaf.y + distanceBetweenNodeLevels;
		draw(leaf.data, leaf.x, leaf.y, width, height, "#ca6ef1", "white");
		drawLineBetween2Nodes(nodeOfLeaf, leaf);

		positions.push({X: leaf.x , Y: leaf.y, Node: leaf});
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
				y = leftChild.y - distanceBetweenNodeLevels;
			}

			node.x = x;
			node.y = y;

			draw(node.hash, x, y, width, height);
			drawLinesToChildren(node);

			positions.push({X: x, Y: y, Node: node});
		});
	});
}

function draw(text, x, y, width, height, backgroundColor, foregroundColor) {
	ctx.fillStyle = backgroundColor || "white";
	ctx.fillRect(x + 2, y + 2, width - 2, height - 2);
	ctx.strokeRect(x, y, width, height);
	ctx.fillStyle = foregroundColor || "black";
	ctx.font = "1.2em serif";

	if(countOfCharactersToShow > 4){
		if (text.length > countOfCharactersToShow) text = text.slice(0, countOfCharactersToShow - 2) + "...";
		ctx.fillText(text, x + 2, y + height - height / 3);
	}
}

function drawLine(xA, yA, xB, yB) {
	ctx.beginPath();
	ctx.moveTo(xA, yA);
	ctx.lineTo(xB, yB);
	ctx.stroke();

	if (maxX < xA) maxX = xA;
	if (maxX < xB) maxX = xB;
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

	if (maxX < nodeA.x) maxX = nodeA.x;
	if (maxX < nodeB.x) maxX = nodeB.x;
}

function drawLinesToChildren(node) {
	if (node.leftChild) drawLineBetween2Nodes(node, node.leftChild);

	if (node.rightChild) drawLineBetween2Nodes(node, node.rightChild);
}
