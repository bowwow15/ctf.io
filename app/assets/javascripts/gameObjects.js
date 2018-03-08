//set variables for html dom use and reference
var HudItem;

var Map;

var playerSpeed;

var augmentedPlayer;

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
Map = {
  translateView: [0, 0] //used to determine where the screen is viewing on the map... (usage: translateView[x, y])
};

$.get( "getMap", function( data ) {
  Map = $.extend(Map, JSON.parse(data)); //extends existing map obejct
});


var Player = { // just player data and draw player function
  size: 40,
  color: false,
  x: 150, //ABSOLUTE COORDINATES TO BE SENT TO SERVER... (or other uses)
  y: 150,

  draw: function () {
    
  },

  move: function (x, y) {
    this.x += x; //changes coordinates on the client side. (absolute coords)
    this.y += y;

    //detect canvas edge, and edit translateView[]
    augmentedPlayer = [this.x + Map.translateView[0], this.y + Map.translateView[1]]; // [x, y] ... basically the augmented coordinates, augmented by the view of the canvas...
    var marginOfMovement = 150;
    var canvasEdge = [canvas.height - Player.size - marginOfMovement, canvas.width - Player.size - marginOfMovement, 0 + Player.size + marginOfMovement, 0 + Player.size + marginOfMovement]; // [top, right, bottom, left] ... detects the edge of canvas

    if (augmentedPlayer[1] > canvasEdge[0]) { // stops at top edge
      Map.translateView[1] -= playerSpeed; //decleared in game.js
    }

    if (augmentedPlayer[0] > canvasEdge[1]) { // stops at right edge
      Map.translateView[0] -= playerSpeed;
    }

    if (augmentedPlayer[1] < canvasEdge[2]) { // stops at bottom edge
      Map.translateView[1] += playerSpeed;
    }

    if (augmentedPlayer[0] < canvasEdge[3]) { // stops at left edge
      Map.translateView[0] += playerSpeed;
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

    case 49:
      key1 = true;
      break;
    case 50:
      key1 = true;
      break;
    case 51:
      key1 = true;
      break;
    case 52:
      key1 = true;
      break;
    case 53:
      key1 = true;
      break;
    case 54:
      key1 = true;
      break;
    case 55:
      key1 = true;
      break;
    case 56:
      key1 = true;
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

    case 49:
      key1 = false;
      break;
    case 50:
      key1 = false;
      break;
    case 51:
      key1 = false;
      break;
    case 52:
      key1 = false;
      break;
    case 53:
      key1 = false;
      break;
    case 54:
      key1 = false;
      break;
    case 55:
      key1 = false;
      break;
    case 56:
      key1 = false;
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