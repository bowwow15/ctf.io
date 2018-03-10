$(document).ready(function () {
	//initiate WebSockets...

	//runs when HTML page loads...

	Context.create("canvas");
	resizeCanvas();

	HudItem = {
		slot_1: null,
		slot_2: null,
		slot_3: null,
		slot_4: null,
		slot_5: null,
		slot_6: null,
		slot_7: null,
		slot_8: null,

		selectedItem: 0, //default index selected

		drawItems: function () {
			//draws the items in your HUD (HTML HUD!)
			//ajax get request to get HUD
			$.get( "getHUD", function( data ) {
			  
			});
		},

		select: function (id) {
			//selects item from HTML HUD
			if (id != this.selectedItem) { //that would deselect the HUD item... don't do that
				document.getElementById("hudSlot" + id).classList.add('hudSelected');
				document.getElementById("hudSlot" + this.selectedItem).classList.remove('hudSelected'); //removes class from deselected item
				this.selectedItem = id;
			}
		}
	};


	var drawContentAnimation;
	function drawContent () {
		window.setTimeout(function() {

			drawContentAnimation = requestAnimationFrame(drawContent);
			ctx.clearRect(0, 0, canvas.width, canvas.height); //clears last input

			drawGrid(200, 200, Map.mapLimit[0], Map.mapLimit[1]); //maplimit declared in gameobjects

			ctx.beginPath(); //resets path that is being drawn.

			//below variables defined in gameObjects.js
			playerX = Player.x - Map.translateView[0]; //(translateView[x, y])
			playerY = Player.y - Map.translateView[1]; // 0 = x, 1 = y.

			ctx.arc(playerX, playerY, Player.size / Map.scope, 0, 2*Math.PI, false); // ! augmented by Map.translateView and other such variables !
			
			if (Player.color != true) {
				ctx.fillStyle = '#ffe0bd'; //skin tone
			}
			else {
				ctx.fillStyle = 'blue';
			}
			ctx.strokeStyle = '#274729';
			ctx.lineWidth = 7;
			ctx.stroke();
			ctx.fill();

			//controls

			playerSpeed = 2; //default setting sets the speed of player 

			if (keyShift == true) {
				playerSpeed = 3;
			}
			if (keyAlt == true) { //sneaking
				playerSpeed = 1;
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

			Player.move(0, 0); //Important for formatting canvas view...

		}, 1000 / Game.fps);

		//cancelAnimationFrame(drawContentAnimation);
	}


	var Game = { // holds framerate and function to draw a frame
	  fps: 60, // frames per second

	  draw: function () {
	  	// drawGrid();

	    drawContent(); //referenced below... somewhere.
	  },

	  drawCoords: function () {

	  }
	};

	function startFrameCycle () {
		Game.draw();
	}

	function start () {
		startFrameCycle();
		$("#playButton").hide();
	}

	start();
});