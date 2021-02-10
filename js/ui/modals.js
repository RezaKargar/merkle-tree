const modalsWrapper = document.getElementById("modal-wrapper");

const closeButton = modalsWrapper.querySelector(".modal-close-btn");
const inputModalCancelButton = modalsWrapper.querySelector(
	".action-btns-wrapper .btn-danger"
);

closeButton.addEventListener("click", hideInputModal);
inputModalCancelButton.addEventListener("click", hideInputModal);
document.addEventListener("mousedown", (e) => {
	if (!modalsWrapper.contains(e.target)) hideInputModal();
});

function showInputModal(message) {
	modalsWrapper.removeAttribute("hidden");
	const messageLabel = modalsWrapper.querySelector("label");
	messageLabel.innerText = message;

	const input = modalsWrapper.querySelector("input");
}

function hideInputModal() {
	modalsWrapper.setAttribute("hidden", "");
}
