//this file contains JavaScript canvas objects used in game.js, or other places...

//set variables for html dom use and reference
var HudItem;

var playerSpeed;

var PlayerX;
var PlayerY;

var AugmentedPlayer;

var canvasWidthCenter;
var canvasHeightCenter;

var Map;
var Hud;

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

Map = {
  translateView: [0, 0], //used to determine where the screen is viewing on the map... (usage: translateView[x, y])
  spawnPoint: [0, 0], //default
  scope: 1,

  zoom: function (scopeChange) {
    this.scope += scopeChange;
    // this.translateView[0] = this.translateView[0] / (this.scope);
    // this.translateView[1] = this.translateView[1] / (this.scope);
  }
};

Hud = {
  toggle: function () {
    $('.hud').toggle();
  }
};

//CANVAS JS BELOW
var Context = {
  canvas: null,
  context: null,

  create: function (canvas_tag_id) {
    this.canvas = document.getElementById(canvas_tag_id); // Initializes canvas by element ID
    this.context = this.canvas.getContext('2d'); // 2 dimentional canvas
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

var boxesX;
var boxesY;
var drawGrid = function(w, h, maxX, maxY) {

  w = w; //this sets the grid proportional to the zoom...
  h = h;

  maxX = maxX;
  maxY = maxY;
  

  //first, lets draw a square that is as big as the map dimentions...
  ctx.strokeStyle = '#547a40'; // dark green
  ctx.fillStyle = '#72a958'; // same as backrgound
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.rect((0 - Map.translateView[0] - ctx.lineWidth), (0 - Map.translateView[1] - ctx.lineWidth), (Math.round(maxX) + (ctx.lineWidth*2)), (Math.round(maxY) + (ctx.lineWidth*2))); //always implement translateView[]
  ctx.shadowColor = '#547a40';
  ctx.shadowBlur = 1000;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.stroke();
  ctx.fill();

  //reset once done
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#629953';
  ctx.lineWidth = 1;

  for (boxesX = 0; (boxesX*w / 2) < maxX; boxesX++) { //draws horizontal squares...
    let mapGridXZeroHorizontal = (0 - Map.translateView[0]) + (boxesX*w / 2); //calculations for grid boxes horizontally
    let mapGridYZeroHorizontal = (0 - Map.translateView[1]) + (boxesY*h / 2);

    ctx.beginPath();

    ctx.rect(mapGridXZeroHorizontal, mapGridYZeroHorizontal, w, h); // implementing translateView to effect the movement
    ctx.stroke();

    for (boxesY = 0; (boxesY*h / 2) < maxY - w; boxesY++) { //then vertical squares.
      let mapGridXZeroVertical = (0 - Map.translateView[0]) + (boxesX*w / 2); //calculations for grid boxes vertically
      let mapGridYZeroVertical = (0 - Map.translateView[1]) + (boxesY*h / 2);

      ctx.beginPath();

      ctx.rect(mapGridXZeroVertical, mapGridYZeroVertical, w, h); // implementing translateView to effect the movement
      ctx.stroke();
      boxesY += 1;
    }

    boxesX += 1;
  }
};


var Player = { // just player data and draw player function
  size: 40,
  turnRadius: 0,
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
    AugmentedPlayer = {
      coords: [(this.x - Map.translateView[0]), (this.y - Map.translateView[1])], // [x, y] devides by Map.scope because zoomed out looks slower ... basically the augmented coordinates, augmented by the view of the canvas...
      size: Player.size
    };

    var marginOfMovement = 200; // margin of movement before the view starts following the player. See Map.translateView[]

    var canvasEdge = [(canvas.height - AugmentedPlayer.size - marginOfMovement), (canvas.width - Player.size - marginOfMovement), (0 + Player.size + marginOfMovement), (0 + Player.size + marginOfMovement)]; // [top, right, bottom, left] ... detects the edge of canvas

    if (AugmentedPlayer.coords[1] > canvasEdge[0]) { // stops at top edge
      Map.translateView[1] += playerSpeed; //decleared in game.js
    }

    if (AugmentedPlayer.coords[0] > canvasEdge[1]) { // stops at right edge
      Map.translateView[0] += playerSpeed;
    }

    if (AugmentedPlayer.coords[1] < canvasEdge[2]) { // stops at bottom edge
      Map.translateView[1] -= playerSpeed;
    }

    if (AugmentedPlayer.coords[0] < canvasEdge[3]) { // stops at left edge
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
    case 18:
      keyAlt = true;
      break;
    case 67: //b
      keyC = true;
      break;
    case 72:
      keyH = true;
      break;
    case 189:
      //ZOOMS OUT
      Map.zoom(0.1);
      break;
    case 187:
      //ZOOMS OUT
      Map.zoom(-0.1);
      break;
  }

  if (keyCode >= 49 && keyCode <= 56) {
    HudItem.select(keyCode - 49); //49 - 49 = 0.
  }

 //  if (keyC == true) {
	// 	if (Player.color != true) {
	// 		Player.color = true;
	// 	}
	// 	else {
	// 		Player.color = false;
	// 	}
	// }

  if (keyH == true) {
    Hud.toggle();
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
    case 18:
      keyAlt = false;
      break;
    case 67: //b
      keyC = false;
      break;
    case 72:
      keyH = false;
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
var keyAlt = false;
var keyC = false;
var keyH = false;

//for HUD
var key1 = false;
var key2 = false;
var key3 = false;
var key4 = false;
var key5 = false;
var key6 = false;
var key7 = false;
var key8 = false;