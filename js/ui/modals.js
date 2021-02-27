const modalsWrapper = document.getElementById("modal-wrapper");

const closeButton = modalsWrapper.querySelector(".modal-close-btn");
const inputModalCancelButton = modalsWrapper.querySelector(
	".action-btns-wrapper .btn-danger"
);

const inputModalSubmitButton = modalsWrapper.querySelector(
	".action-btns-wrapper .btn-info"
);

const input = modalsWrapper.querySelector("input");

closeButton.addEventListener("click", hideInputModal);
inputModalCancelButton.addEventListener("click", hideInputModal);
document.addEventListener("mousedown", (e) => {
	if (!modalsWrapper.contains(e.target)) hideInputModal();
});

function showInputModal(message, callback = null) {
	const messageLabel = modalsWrapper.querySelector("label");
	
	messageLabel.innerText = message;

	modalsWrapper.removeAttribute("hidden");
	input.focus();
	

	inputModalSubmitButton.addEventListener("click", function submitButtonClickHandler() {
		let inputValue = input.value;
		callback(inputValue);
		hideInputModal();
		inputModalSubmitButton.removeEventListener("click", submitButtonClickHandler);
	});
}

function hideInputModal() {
	modalsWrapper.setAttribute("hidden", "");
	input.value = "";
}
