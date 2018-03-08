$(document).ready(function () {
	//runs when HTML page loads...

	Context.create("canvas");
	resizeCanvas();

	// GETS MAP DATA FROM SERVER
	var Map;

	$.get( "getMap", function( data ) {
		Map = JSON.parse(data); //map obejct
	});

	var Game = { // holds framerate and function to draw a frame
		fps: 60, //not in use

		draw: function () {
			drawPlayer(); //referenced below... somewhere.
		}
	};

	var Player = { // just player data and draw player function
		size: 40,
		color: false,
		x: 0, //ABSOLUTE COORDINATES TO BE SENT TO SERVER... (or other uses)
		y: 0,

		draw: function () {
			
		},

		move: function (x, y) {
			this.x += x; //changes coordinates on the client side. (absolute coords)
			this.y += y;
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
			//ajax get request to get HUD
			$.get( "getHUD", function( data ) {
			  
			});
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
				playerSpeed = 4;
			}
			if (keyD == true) {
			  Player.move(playerSpeed, 0);
			}
			if (keyS == true) {
			  Player.move(0, playerSpeed);
			}
			if (keyA == true) {
			  Player.move(-playerSpeed, 0);
			}
			if (keyW == true) {
			  Player.move(0, -playerSpeed);
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