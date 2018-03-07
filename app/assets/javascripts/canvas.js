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

	(function() {
	  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	  window.requestAnimationFrame = requestAnimationFrame;
	})();

	//event listener
	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keyup", onKeyUp, false);

	function onKeyDown(event) {
	  var keyCode = event.keyCode;
	  switch (keyCode) {
	    case 68: //d
	      keyD = true;
	      break;
	    case 83: //s
	      keyS = true;
	      break;
	    case 65: //a
	      keyA = true;
	      break;
	    case 87: //w
	      keyW = true;
	      break;
	    case 16: //shift key (sprint)
	      keyShift = true;
	      break;
	  }
	}

	function onKeyUp(event) {
	  var keyCode = event.keyCode;

	  switch (keyCode) {
	    case 68: //d
	      keyD = false;
	      break;
	    case 83: //s
	      keyS = false;
	      break;
	    case 65: //a
	      keyA = false;
	      break;
	    case 87: //w
	      keyW = false;
	      break;
	    case 16: //shift key (sprint)
	      keyShift = false;
	      break;
	  }
	}

	//neccessary variables
	var tickX = 10;
	var tickY = 10;

	var keyW = false;
	var keyA = false;
	var keyS = false;
	var keyD = false;
	var keyShift = false;

	var Player = { // just player data and draw player function
		size: 40,
		playerMoveX: 0,
		playerMoveY: 0,

		draw: function () {
			
		}
	};

	function drawPlayer () {
		window.requestAnimationFrame(drawPlayer);
		ctx.clearRect(0, 0, canvas.width, canvas.height); //clears last input

		var playerX = canvas.width / 2 + Player.playerMoveX;
		var playerY = canvas.height / 2 + Player.playerMoveY;

		ctx.beginPath(); //resets path that is being drawn.

		ctx.arc(playerX, playerY, Player.size, 0, 2*Math.PI, false);
		ctx.fillStyle = '#ffe0bd'; //skin tone
		ctx.stroke();
		ctx.fill();

		//controls

		playerSpeed = 2; //default setting sets the speed of player 

		if (keyShift == true) {
			playerSpeed = 3;
		}

		if (keyD == true) {
		  Player.playerMoveX += playerSpeed;
		}
		if (keyS == true) {
		  Player.playerMoveY += playerSpeed;
		}
		if (keyA == true) {
		  Player.playerMoveX -= playerSpeed;
		}
		if (keyW == true) {
		  Player.playerMoveY -= playerSpeed;
		}
	}

	var Frame = { // holds framerate and function to draw a frame
		fps: 30,

		showFps: function () {
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.font = "15px Arial";
			ctx.fillText(this.fps + " fps",10,20);
		},

		draw: function () {
			window.requestAnimationFrame(drawPlayer);
			this.showFps();
		}
	};

	function startFrameCycle () {
		//window.setInterval(function() {
			Frame.draw();
		//}, 1000 / Frame.fps);
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