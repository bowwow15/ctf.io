//CANVAS JS BELOW
var Context = {
	canvas: null,
	context: null,

	create: function (canvas_tag_id) {
		this.canvas = document.getElementById(canvas_tag_id); // Initializes canvas by element ID
		this.context = this.canvas.getContext('2d'); // 2 dimentional canvas
	}
};

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
}

$(document).ready(function () {
	//runs when HTML page loads...

	Context.create("canvas");
	resizeCanvas();

	function drawClientPlayer () {
		Context.context.beginPath(); //resets path that is being drawn.

		Context.context.beginPath();
		Context.context.arc(canvas.width / 2 - 20,canvas.height / 2 - 20,40,0,2*Math.PI);
		Context.context.fillStyle = '#fff4d9'; //skin tone
		Context.context.stroke();
		Context.context.fill();
	}

	drawClientPlayer();

	Context.context.beginPath();
});