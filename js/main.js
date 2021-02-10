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
