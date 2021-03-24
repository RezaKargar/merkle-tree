const contextMenuTag = document.getElementById("context-menu");
const ulElementOfContextMenu = contextMenuTag.getElementsByTagName("ul")[0];

buildContextMenu();

function buildContextMenu() {
	let addNewLeafItemInContextMenu = document.createElement("li");
	addNewLeafItemInContextMenu.id = "add-new-leaf";
	addNewLeafItemInContextMenu.innerText = "Add new leaf";
	addNewLeafItemInContextMenu.addEventListener(
		"click",
		addNewLeafItemInContextMenuClick
	);

	let showNodeInfoItemInContextMenu = document.createElement("li");
	showNodeInfoItemInContextMenu.id = "show-node-info";
	showNodeInfoItemInContextMenu.innerText = "Show node info";

	document.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		contextMenuTag.style.left = `${e.pageX + 5}px`;
		contextMenuTag.style.top = `${e.pageY + 5}px`;
		const nodeWhichHasBeenClickedOn = positions.filter(
			(item) =>
				item.X <= e.clientX &&
				item.X + width >= e.clientX &&
				item.Y <= e.clientY &&
				item.Y + height >= e.clientY
		);

		ulElementOfContextMenu.appendChild(addNewLeafItemInContextMenu);
	
		if (ulElementOfContextMenu.contains(showNodeInfoItemInContextMenu))
			ulElementOfContextMenu.removeChild(showNodeInfoItemInContextMenu);

		if (nodeWhichHasBeenClickedOn.length > 0) {
			ulElementOfContextMenu.removeChild(addNewLeafItemInContextMenu);
			showNodeInfoItemInContextMenu.addEventListener(
				"click",
				function eventListenerForShowNodeInfo() {
					showNodeInfo(nodeWhichHasBeenClickedOn[0].Node);
					showNodeInfoItemInContextMenu.removeEventListener(
						"click",
						eventListenerForShowNodeInfo,
						true
					);
				},
				true
			);
			ulElementOfContextMenu.appendChild(showNodeInfoItemInContextMenu);
		} else {
			ulElementOfContextMenu.appendChild(addNewLeafItemInContextMenu);
		}
		showContextMenu();
	});
}

function showContextMenu() {
	contextMenuTag.removeAttribute("hidden");
}

function showNodeInfo(node) {
	const message = node.hash
		? `Hash of Node : \n ${node.hash}`
		: `Data of Leaf : \n ${node.data}`;
	showMessageModal(message);
	hideContextMenu();
}

function hideContextMenu() {
	contextMenuTag.setAttribute("hidden", "");
}

function addNewLeafItemInContextMenuClick() {
	hideContextMenu();
	showInputModal("Please add leaf's data", async (value) => {
		if (!value) return;
		let newLeaf = new Leaf(value);
		tree.addLeaf(newLeaf);
		await tree.buildTree();
	});
}
