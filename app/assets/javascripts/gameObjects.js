//this file contains JavaScript canvas objects used in game.js, or other places...

//set variables for html dom use and reference
var HudItem;

var playerSpeed;

var augmentedPlayer;

var PlayerX;
var PlayerY;

var canvasWidthCenter;
var canvasHeightCenter;

var ServerGameObject = {
	x: 50,
	y: 50,
	width: 50,
	height: 50,
	testObject: function () {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = 'black';
		ctx.fill();
	}
};


// GETS MAP DATA FROM SERVER

$.ajax({
  url: "getMap",
  async: false,
}).done(function( data ) {

  Map = $.extend(Map, JSON.parse(data)); //extends existing map obejct (MAP OBJECT DECLARED IN CANVAS.JS)

  canvasWidthCenter = GameCanvas.width;
  canvasHeightCenter = GameCanvas.height / 2;

  Map.translateView[0] = Map.spawnPoint[0] - canvasWidthCenter;
  Map.translateView[1] = Map.spawnPoint[1] - canvasHeightCenter;

});


var Player = { // just player data and draw player function
  size: 40,
  color: false,
  x: Map.spawnPoint[0], //ABSOLUTE COORDINATES TO BE SENT TO SERVER... (or other uses)
  y: Map.spawnPoint[1],

  draw: function () {
    
  },

  mapEdgeDetect: function (x, y) {
    var move = true; //sets default
    var edgeStop = 25; //margin that player stops from edge of map

    //check if near the edge of map
    if (x < 0) { //moving left
      if (this.x < 0 + this.size + edgeStop) {
        move = false;
      }
    }
    if (x > 0) { //moving right
      if (this.x > Map.mapLimit[0] - this.size - edgeStop) {
        move = false;
      }
    }
    if (y < 0) { //moving up
      if (this.y < 0 + this.size + edgeStop) {
        move = false;
      }
    }
    if (y > 0) { //moving down
      if (this.y > Map.mapLimit[1] - this.size - edgeStop) {
        move = false;
      }
    }

    return move;
  },

  move: function (x, y) {
    var move = true; //sets default

    move = this.mapEdgeDetect(x, y);

    if (move === true) {
      this.x += x; //changes coordinates on the client side. (absolute coords)
      this.y += y;
    }

    //detect canvas edge, and edit translateView[]
    augmentedPlayer = [this.x - Map.translateView[0], this.y - Map.translateView[1]]; // [x, y] ... basically the augmented coordinates, augmented by the view of the canvas...
    var marginOfMovement = 200;

    var canvasEdge = [canvas.height - Player.size - marginOfMovement, canvas.width - Player.size - marginOfMovement, 0 + Player.size + marginOfMovement, 0 + Player.size + marginOfMovement]; // [top, right, bottom, left] ... detects the edge of canvas

    if (augmentedPlayer[1] > canvasEdge[0]) { // stops at top edge
      Map.translateView[1] += playerSpeed; //decleared in game.js
    }

    if (augmentedPlayer[0] > canvasEdge[1]) { // stops at right edge
      Map.translateView[0] += playerSpeed;
    }

    if (augmentedPlayer[1] < canvasEdge[2]) { // stops at bottom edge
      Map.translateView[1] -= playerSpeed;
    }

    if (augmentedPlayer[0] < canvasEdge[3]) { // stops at left edge
      Map.translateView[0] -= playerSpeed;
    }

    return [this.x, this.y];
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

  if (keyCode >= 49 && keyCode <= 56) {
    HudItem.select(keyCode - 49); //49 - 49 = 0.
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

//for HUD
var key1 = false;
var key2 = false;
var key3 = false;
var key4 = false;
var key5 = false;
var key6 = false;
var key7 = false;
var key8 = false;