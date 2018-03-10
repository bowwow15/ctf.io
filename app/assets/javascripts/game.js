var Start;
var EndGame;

var playerName; //set by websocket server

App.cable.subscriptions.create({
  channel: "GameChannel",
  id: 1
},{
  received: function(data) {
  	//does nothing
  }
});

//initiate WebSockets...

//runs when HTML page loads...

Context.create("canvas");
resizeCanvas();

var Game = { // holds framerate and function to draw a frame
  fps: 60, // frames per second
  running: false,

  draw: function () {
  	// drawGrid();

    drawContent(); //referenced below... somewhere.
  },

  drawCoords: function () {

  }
};

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
	// window.setTimeout(function() {

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

		Player.drawName(playerX, playerY);

		//controls

		playerSpeed = 3; //default setting sets the speed of player 

		if (keyShift == true) {
			playerSpeed = 4;
		}
		if (keyAlt == true) { //sneaking
			playerSpeed = 2;
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

	// }, 1000 / Game.fps);
}


function startFrameCycle () {
	Game.draw();
}

Start = function () {
	App.game.get_name();
	startFrameCycle();
	window.setTimeout(function() {
		App.game.get_name(); //just in case it doesn't show up
	}, 1000);
}

EndGame = function () {
	cancelAnimationFrame(drawContentAnimation);
	$("#status").html("<span style='color: red'>connection lost</span>");
}

function startGame () {
	var name = $("#name").val();

	$("#name").slideUp(500); //500 ms (1/2) of a second

	addKeyEventListeners(); //detect game keystrokes

	App.game.start_game(name);
}


