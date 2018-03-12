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

var OnlinePlayers;


var Game = { // holds framerate and function to draw a frame
  fps: 60, // frames per second
  running: false,
  players: [null],
  guns: [],
  mousePos: [0, 0],

  draw: function () {
    // drawGrid();

    App.game.move_player([Player.x, Player.y]); //tell server your coordinates

    drawContent(); //referenced below... somewhere.

    // used for debugging: eval(prompt("function"));
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
  },

  //determines weather the selected item is a gun or not.
  determineGun: function (inventoryItem) {
    var bool = false;
    var hands = 2;

    if (Game.guns.indexOf(inventoryItem) >= 0) {
      bool = true;
    }

    switch (inventoryItem) {
      case "glock_19":
        hands = 1;
        break;
    }

    return {
      bool: bool,
      hands: hands
    };
  }
};

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

OnlinePlayers = {
  //see global.coffee and game.coffee
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
  rotation: 0,
  speed: 3,
  center: false,
  sneakSpeed: 1,
  sprintSpeed: 4,
  name: "",
  inventory: ["empty","empty","empty","empty","empty","empty","empty","empty"],
  skinTone: '#fcc875',
  self_uuid: null,
  nameSize: 35,
  nameFont: "Helvetica",
  nameMargin: 10,
  turnRadius: 0,
  color: false,
  x: Map.spawnPoint[0], //ABSOLUTE COORDINATES TO BE SENT TO SERVER... (or other uses)
  y: Map.spawnPoint[1],

  drawPerson: function (x, y) {
      ctx.beginPath(); //resets path that is being drawn.

      ctx.arc(x, y, Player.size / Map.scope, 0, 2*Math.PI, false); // ! augmented by Map.translateView and other such variables !

      if (this.color != true) {
        ctx.fillStyle = Player.skinTone; //skin tone
      }
      else {
        ctx.fillStyle = 'blue';
      }
      ctx.strokeStyle = '#274729';
      ctx.lineWidth = 7;
      // ctx.stroke();
      ctx.fill();
  },

  drawName: function (x, y, name) {
    if (name) { // name might be undifined?

      ctx.beginPath(); //resets path that is being drawn.
      ctx.fillStyle = 'white';
      ctx.textAlign="center";

      calculatedNameSize = (this.size*3 / (name.length / 2)).toString();
      if (calculatedNameSize < this.nameSize) {
        this.nameSize = calculatedNameSize;
      }

      ctx.font = this.nameSize + "px " + this.nameFont;
      ctx.fillText(name, x, y - this.size - this.nameMargin);         //math for formatting... subtract from y axis to draw name above player
    }
  },

  drawHands: function (x, y, rotation, gun) {
    //draws two circles to represent hands on a player.
    ctx.fillStyle = this.skinTone;

    ctx.strokeStyle = '#274729';
    ctx.lineWidth = 7;
      
    leftHand = [-(Player.size / 2 + 15), -(Player.size / 2 + 15)]; //default hand settings
    rightHand = [(Player.size / 2 + 15), -(Player.size / 2 + 15)];

    if (gun.bool === true) {
      if (gun.hands == 2) { //only draws left hand if there are two hands required for the gun
        leftHand = [-(Player.size / 2 - 15), -(Player.size / 2 + 60)]; //places hands to hold a
      }
      rightHand = [(Player.size / 2 - 10), -(Player.size / 2 + 30)];
    }

    //left hand
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.arc(x + leftHand[0], y + leftHand[1], (Player.size / 3) / Map.scope, 0, 2*Math.PI, false);

    ctx.stroke();
    ctx.fill();
    ctx.resetTransform();

    //right hand
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.arc(x + rightHand[0], y + rightHand[1], (Player.size / 3) / Map.scope, 0, 2*Math.PI, false);

    ctx.stroke();
    ctx.fill();
    ctx.resetTransform();

    if (this.color != true) {
      ctx.fillStyle = Player.skinTone; //skin tone
    }
    else {
      ctx.fillStyle = 'blue';
    }
  },

  drawGun: function (x, y, rotation, gunType) {
    if (gunType != "empty") {
      ctx.fillStyle = 'black';

      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 7;

      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.translate(-x, -y);

      switch (gunType) {
        case "glock_19":
          ctx.beginPath();
          ctx.ellipse(x + 10, y - 50, 5, 45, 0 * Math.PI/180, 0, 2 * Math.PI);

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;

        case "ar_15":
          ctx.beginPath();
          ctx.ellipse(x + 10, y - 75, 5, 45, 0 * Math.PI/180, 0, 2 * Math.PI);

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;
      }
    }
  },

  drawAll: function (x, y, rotation, name, inventoryItem) {
    x = x - Map.translateView[0]; //augmented by player's view
    y = y - Map.translateView[1];

    var gun = HudItem.determineGun(inventoryItem); //returns object. bool = true, hands = 1, or 2

    this.drawGun(x, y, rotation, inventoryItem);

    this.drawPerson(x, y);

    this.drawHands(x, y, rotation, gun);

    this.drawName(x, y, name);
  },

  updateInventory: function () {
    $(".hudSlot").each(function( index ) {
      if (Player.inventory[index] != "empty") {
        //$("#hudSlot" + index).html("<img src='/images/inventory/" + Player.inventory[index] + ".ico' class='hudSlotImage'>");
        $("#hudSlot" + index).html("<span class='inventoryText'>(" + Player.inventory[index] + ")</span>");
      }
    });
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

  moveServerPlayer: function () {
    App.game.move_player([this.x, this.y, this.rotation, this.inventory[HudItem.selectedItem]]);
  },

  move: function (x, y) {
    var move = true; //sets default

    move = this.mapEdgeDetect(x, y);

    if (move === true) {
      this.x += x; //changes coordinates on the client side. (absolute coords)
      this.y += y;

      //tell server that you moved
      if (x != 0 || y != 0) { //if movement doesn't equal the last coordinates
        this.moveServerPlayer();

        if (Player.center === true) {
          Map.translateView[0] += x;
          Map.translateView[1] += y;
        }
      }
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
  },

  die: function () {
    cancelAnimationFrame(drawContentAnimation);

    //displays death screen
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = 'black';
    ctx.fill();

    //Title
    ctx.beginPath(); //resets path that is being drawn.
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.lineWidth = 1;

    ctx.font = "100px Arial";
    ctx.textAlign="center";

    ctx.fillText("You Died", canvas.width / 2, canvas.height / 2 + 50);
    ctx.strokeText("You Died", canvas.width / 2, canvas.height / 2 + 50); 
  }
};

(function() { //request animation frame
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

//event listeners...

function addKeyEventListeners () { //calls this function after username is entered
  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
}

$("body").mousemove(function(e) {
    //tells the server that you "moved"
    Player.moveServerPlayer();

    Game.mousePos[0] = e.pageX;
    Game.mousePos[1] = e.pageY;
})

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

  if (keyC == true) {
		Player.center = !Player.center; //toggles Player.center
	}

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