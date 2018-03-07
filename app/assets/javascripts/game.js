$(document).ready(function () {
	//runs when HTML page loads...

	Context.create("canvas");
	resizeCanvas();

	var Game = { // holds framerate and function to draw a frame
		fps: 60, //not in use

		draw: function () {
			drawPlayer(); //referenced below... somewhere.
		}
	};

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
	    case 67: //b
	      keyC = true;
	      break;
	  }

	  if (keyC == true) {
					if (Player.color != true) {
						Player.color = true;
					}
					else {
						Player.color = false;
					}
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
	    case 67: //b
	      keyC = false;
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
	var keyC = false;

	var Player = { // just player data and draw player function
		size: 40,
		color: false,
		x: 0,
		y: 0,

		draw: function () {
			
		}
	};

	var HudItems = {
		slot_1: null,
		slot_2: null,
		slot_3: null,
		slot_4: null,
		slot_5: null,
		slot_6: null,
		slot_7: null,
		slot_8: null,

		drawItems: function () {
			//draws the items in your HUD (HTML HUD!)
		}
	};

	var drawPlayerAnimation;
	function drawPlayer () {
		window.setTimeout(function() {

			drawPlayerAnimation = requestAnimationFrame(drawPlayer);
			ctx.clearRect(0, 0, canvas.width, canvas.height); //clears last input

			var playerX = canvas.width / 2 + Player.x;
			var playerY = canvas.height / 2 + Player.y;

			ctx.beginPath(); //resets path that is being drawn.

			ctx.arc(playerX, playerY, Player.size, 0, 2*Math.PI, false);
			if (Player.color != true) {
				ctx.fillStyle = '#ffe0bd'; //skin tone
			}
			else {
				ctx.fillStyle = 'blue';
			}
			ctx.strokeStyle = '#274729';
			ctx.stroke();
			ctx.fill();

			//controls

			playerSpeed = 2; //default setting sets the speed of player 

			if (keyShift == true) {
				playerSpeed = 3.5;
			}
			if (Player.x < ServerGameObject.x + ServerGameObject.width  && Player.x + Player.width  > ServerGameObject.x &&
			Player.y < ServerGameObject.y + ServerGameObject.height && Player.y + Player.height > ServerGameObject.y) {
				alert("test");
			}
			if (keyD == true) {
			  Player.x += playerSpeed;
			}
			if (keyS == true) {
			  Player.y += playerSpeed;
			}
			if (keyA == true) {
			  Player.x -= playerSpeed;
			}
			if (keyW == true) {
			  Player.y -= playerSpeed;
			}

		}, 1000 / Game.fps);

		//cancelAnimationFrame(drawPlayerAnimation);
	}

	function startFrameCycle () {
		Game.draw();
	}

	function start () {
		startFrameCycle();
		$("#playButton").hide();
	}

	start();
});