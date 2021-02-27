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

	ulElementOfContextMenu.appendChild(addNewLeafItemInContextMenu);

	document.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		contextMenuTag.style.left = `${e.pageX + 5}px`;
		contextMenuTag.style.top = `${e.pageY + 5}px`;
		showContextMenu();
	});
}

function showContextMenu(){
	contextMenuTag.removeAttribute("hidden");
}

function hideContextMenu() {
	contextMenuTag.setAttribute("hidden", "");
}

function addNewLeafItemInContextMenuClick() {
    hideContextMenu();
    showInputModal("Please add leaf's data", async (value) => {
        let newLeaf = new Leaf(value);
		tree.addLeaf(newLeaf);
		await tree.buildTree();
    });
}