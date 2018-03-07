//CANVAS JS BELOW
var Context = {
	canvas: null,
	context: null,

	create: function (canvas_tag_id) {
		this.canvas = document.getElementById(canvas_tag_id); // Initializes canvas by element ID
		this.context = this.canvas.getContext('2d'); // 2 dimentional canvas
	}
};


ctx = Context.context; //important shorthand notice


// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);


$(document).ready(function () {
	//runs when HTML page loads...

	Context.create("canvas");
	resizeCanvas();

	var Player = { // just player data and draw player function
		size: 40,
		playerMoveX: 0,
		playerMoveY: 0,

		draw: function () {
			var playerX = canvas.width / 2 + this.playerMoveX;
			var playerY = canvas.height / 2 + this.playerMoveY;

			ctx.beginPath(); //resets path that is being drawn.

			ctx.arc(playerX - 10, playerY - 20,this.size, 0, 2*Math.PI);
			ctx.fillStyle = '#ffe0bd'; //skin tone
			ctx.stroke();
			ctx.fill();
		}
	};

	var Frame = { // holds framerate and function to draw a frame
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

function resizeCanvas() { //resizes canvas to browser window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //draws background
        if (ctx === null) {
        	Context.create("canvas");
        	ctx = Context.context;
        }

        ctx.beginPath();
        ctx.fillStyle = '#72a958';
        ctx.rect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fill();
}