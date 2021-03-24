const modalsWrapper = document.getElementById("modal-wrapper");

const actionBtnsWrapper = document.getElementById("actionBtnsWrapper");

const fileUploader = document.getElementById("file");

fileUploader.addEventListener("change", () => (textInput.value = ""));

const closeButton = modalsWrapper.querySelector(".modal-close-btn");
const inputModalCancelButton = modalsWrapper.querySelector(
	".action-btns-wrapper .btn-danger"
);

const inputModalSubmitButton = modalsWrapper.querySelector(
	".action-btns-wrapper .btn-info"
);

const inputWrapper = modalsWrapper.querySelector(".input-wrapper");

const textInput = modalsWrapper.querySelector("input");

closeButton.addEventListener("click", hideInputModal);
inputModalCancelButton.addEventListener("click", hideInputModal);
document.addEventListener("mousedown", (e) => {
	if (!modalsWrapper.hidden && !modalsWrapper.contains(e.target)) {
		hideInputModal();
	}
	else if(!contextMenuTag.hidden && !contextMenuTag.contains(e.target)) {
		hideContextMenu();
	}
});

function showInputModal(message, callback = null) {
	const messageLabel = modalsWrapper.querySelector("label");

	messageLabel.innerText = message;

	modalsWrapper.removeAttribute("hidden");
	textInput.focus();

	inputModalSubmitButton.addEventListener("click", async function submitButtonClickHandler() {
		let inputValue = textInput.value;
		let file = fileUploader.files[0];
		if(file){
			inputValue = await readFileAsync(file);
		}
		callback && callback(inputValue);
		hideInputModal();
		inputModalSubmitButton.removeEventListener(
			"click",
			submitButtonClickHandler,
			true
		);
	}, true
	);
}

function hideInputModal() {
	modalsWrapper.setAttribute("hidden", "");
	textInput.value = "";
	fileUploader.value = "";

	inputWrapper.hidden = false;
	actionBtnsWrapper.hidden = false;
}


function showMessageModal(message) {
	const messageLabel = modalsWrapper.querySelector("label");
	messageLabel.style.overflowWrap = "anywhere";
	messageLabel.innerText = message;

	inputWrapper.hidden = true;
	actionBtnsWrapper.hidden = true;

	modalsWrapper.removeAttribute("hidden");
}