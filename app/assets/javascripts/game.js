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

		drawGrid(200, 200, Map.mapLimit[0], Map.mapLimit[1]); //maplimit declared in gameobjects, drawGrid in canvas.js


		//below methods defined in gameObjects.js

		//local players...

		Player.rotation = Math.atan2(Game.mousePos[0] - (Player.x - Map.translateView[0]), - (Game.mousePos[1] - (Player.y - Map.translateView[1])) )*(180/Math.PI);

		Player.drawAll(Player.x, Player.y, Player.rotation, Player.name)

		//server players...
		Object.keys(OnlinePlayers).forEach(function (uuid) { //draws all players on server
			if (uuid != Player.self_uuid) { // if the player isn't your own
				Player.drawAll(OnlinePlayers[uuid][0], OnlinePlayers[uuid][1], OnlinePlayers[uuid][2], OnlinePlayers[uuid + "_name"]); //OnlinePlayers["(uuid)"] = [coordinates, rotation, player name]
			}
		});

		//controls

		playerSpeed = Player.speed; //default setting sets the speed of player 

		if (keyShift == true) {
			playerSpeed = Player.sprintSpeed;
		}
		if (keyAlt == true) { //sneaking
			playerSpeed = Player.sneakSpeed;
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

	App.game.get_self_uuid();
}

EndGame = function () {
	cancelAnimationFrame(drawContentAnimation);
	$("#status").html("<span style='color: red'>connection lost</span>");
}

function startGame () {
	var name = $("#name").val();

	$("#name").blur();
	$("#name").slideUp(500); //500 ms (1/2) of a second
	$(".upper").fadeOut(500);

	addKeyEventListeners(); //detect game keystrokes

	App.game.start_game(name);
}


