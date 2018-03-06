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
	ctx = Context.context //important shorthand notice

	Context.create("canvas");
	resizeCanvas();

	var Player = {
		size: 40,
		x: canvas.width / 2,
		y: canvas.height / 2,

		draw: function () {
			ctx.beginPath(); //resets path that is being drawn.

			ctx.beginPath();
			ctx.arc(this.x - 10, this.y - 20,this.size,0,2*Math.PI);
			ctx.fillStyle = '#ffe0bd'; //skin tone
			ctx.stroke();
			ctx.fill();
		}
	};

	var Frame = {
		fps: 30,

		showFps: function () {
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.font = "15px Arial";
			ctx.fillText(this.fps + " fps",10,20);
		},

		draw: function () {
			Player.draw();
			this.showFps();
		}
	};

	function startFrameCycle () {
		window.setInterval(function() {
			Frame.draw();
		}, 1000 / Frame.fps);
	}

	function start () {
		startFrameCycle();
		$("#playButton").hide();
	}

	start();
});