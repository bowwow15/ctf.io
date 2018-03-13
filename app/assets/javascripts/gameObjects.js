//Math functions
function getPoint(mx, my, cx, cy, angle) {

    var x, y, dist, diffX, diffY, ca, na;

    diffX = cx - mx;
    diffY = cy - my;
    dist = Math.sqrt(diffX * diffX + diffY * diffY);
    
    /// find angle from pivot to corner
    ca = Math.atan2(diffY, diffX) * 180 / Math.PI;
  
    /// get new angle based on old + current delta angle
    na = ((ca + angle) % 360) * Math.PI / 180;
    
    /// get new x and y and round it off to integer
    x = (mx + dist * Math.cos(na) + 0.5)|0;
    y = (my + dist * Math.sin(na) + 0.5)|0;

    return {x:x, y:y};
}

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

//fps drawing variables
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

var bullet_trail_img = new Image();   // Create new img element
bullet_trail_img.src = '/images/sprites/bullet_trail.png'; // Set source path

var Animation = {
  hurtDraw: false,
  hurtFrames: 0,

  hurt: function (frames) {
    if (this.hurtDraw === true && frames > this.hurtFrames) {
      this.hurtDraw = true;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(209,0,0,.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.hurtFrames += 1;
    }
    else {
      this.hurtDraw = false,
      this.hurtFrames = 0;
    }
  },

  startHurt: function (frames) {
    this.hurtDraw = true;
  },

  drawAll: function () {
    this.hurt(20);
  }
};

var Game = { // holds framerate and function to draw a frame
  fps: 60, // frames per second
  running: false,
  players: [null],
  guns: [],
  bullets: [],
  mousePos: [0, 0],

  draw: function (fps) {
    // drawGrid();

    App.game.move_player([Player.x, Player.y]); //tell server your coordinates

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    drawContent(); //referenced below... somewhere.

    // used for debugging: eval(prompt("function"));
  },

  drawCoords: function () {

  },

  bullet: function (x, y, rotation, velocity, expires, blur = true) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;

    App.game.shoot([x, y, rotation, velocity, expires, blur]);

    //Game.bullets.push([x, y, rotation, velocity, expires]);
    //not using above code because it is already declared in global.coffee
  },

  deleteBullet: function (index) {
    x = Game.bullets[index][0];
    y = Game.bullets[index][1];

    Game.bullets.splice(index, 1); //deletes bullet

    //to do: draw bullet splash
  },

  drawBullets: function () {
    Game.bullets.forEach(function (element, index) {
      var expires = element[4];
      var velocity = element[3];
      var rotation = element[2] - 91;
      let x = element[0];
      let y = element[1];
      var blur = element[5];

      if (expires > 0) {
        Game.bullets[index][4] -= velocity / 10;

        Game.bullets[index][0] += velocity * Math.cos(rotation * Math.PI / 180); //calculate direction of bullet
        Game.bullets[index][1] += velocity * Math.sin(rotation * Math.PI / 180);

        x_augmented = x - Map.translateView[0]; //augmented by player's view
        y_augmented = y - Map.translateView[1];

        //draws bullet
        ctx.beginPath();

        ctx.fillStyle = "black";
        ctx.arc(x_augmented, y_augmented, 3, 0, 2 * Math.PI);

        ctx.fill();

        if (blur === true) {
          //draw blur after bullet
          ctx.beginPath();

          //img variable declared before game object

          ctx.translate(x_augmented, y_augmented);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-x_augmented, -y_augmented);

          ctx.drawImage(bullet_trail_img, x_augmented - bullet_trail_img.width, y_augmented - 2.5); // draws bullet trail image

          ctx.resetTransform();
        }
      }
      else {
        Game.bullets.splice(index, 1); //deletes bullet
      }

    //detect bullet collisions
    let bulletCollision = Player.detectCollision([x, y], [Player.x, Player.y], 5 * velocity / 10, 5 * velocity / 10, Player.size, Player.size);

    if (bulletCollision === true) {
      App.global.delete_bullet(index); //tells server to delete bullet

      Player.gotShot(velocity);
    }

    });
  }
};

var Gun = {
  isGun: false,
  bulletExpires: 50,
  spawnPoint: [0, 0],
  type: "pistol"
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
  droppedItems: [],

  zoom: function (scopeChange) {
    this.scope += scopeChange;
    // this.translateView[0] = this.translateView[0] / (this.scope);
    // this.translateView[1] = this.translateView[1] / (this.scope);
  },

  pickUpItem: function (index) {
    App.game.pick_up_item(index);
  },

  drawDroppedItems: function () {
    this.droppedItems.forEach(function (element, index) {
      let x = element[0] - Map.translateView[0];
      let y = element[1] - Map.translateView[1];
      let name = element[2];

      if (name != false) {
        ctx.beginPath();
        ctx.font="15px Courier";
        ctx.fillStyle = 'black';
        ctx.fillText(name, x, y);
      }

      let textCollision = Player.detectCollision([element[0], element[1]], [Player.x, Player.y], 100, 50, Player.size, Player.size);

      if (textCollision === true) {
        let x_augmented = Player.x - Map.translateView[0] + 50;
        let y_augmented = Player.y - Map.translateView[1] - 50;

        ctx.beginPath();
        ctx.font="30px Courier";
        ctx.fillText("Press F to pick up", x_augmented, y_augmented);

        if (keyF === true) {
          Map.pickUpItem(index);
          keyF = false;
        }
      }
    });
  }
};

Hud = {
  toggle: function () {
    $('.hud').toggle();
  }
};

OnlinePlayers = {
  //see global.coffee and game.coffee

  die: function (x, y) {

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


var Player = {
  size: 40,
  rotation: 0,
  speed: 3,
  lastMove: Date.now(),
  moveMargin: 0,
  handPos: [0, 0],
  ammo: 100,
  health: 100,
  center: false,
  sneakSpeed: 1,
  sprintSpeed: 4,
  name: "",
  inventory: ["empty","empty","empty","empty","empty","empty","empty","empty"],
  skinTone: '#fcc875',
  self_uuid: null,
  nameSize: 20,
  nameFont: "Helvetica",
  nameMargin: 50,
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

      var newNameSize = this.nameSize;

      calculatedNameSize = (this.size*3 / (name.length / 2)).toString();
      if (calculatedNameSize < this.nameSize) {
        newNameSize = calculatedNameSize;
      }

      ctx.font = newNameSize + "px " + this.nameFont;
      ctx.fillText(name, x, y - this.size - this.nameMargin);         //math for formatting... subtract from y axis to draw name above player
      //ctx.strokeText(name, x, y - this.size - this.nameMargin);
    }
  },

  drawHands: function (x, y, rotation, gun) {
    //draws two circles to represent hands on a player.
    ctx.fillStyle = this.skinTone;

    ctx.strokeStyle = '#274729';
    ctx.lineWidth = 7;
      
    leftHand = [-(Player.size / 2 + 10), -(Player.size / 2 + 15)]; //default hand settings
    rightHand = [(Player.size / 2 + 10), -(Player.size / 2 + 15)];

    if (gun.bool === true) {
      if (gun.hands == 2) { //only moves left hand if there are two hands required for the gun
        leftHand = [-(Player.size / 2 - 15), -(Player.size / 2 + 60)]; //places hands to hold a
      }

      rightHand = [(Player.size / 2 - 10), -(Player.size / 2 + 30)];

      Player.handPos[0] = rightHand[0];
      Player.handPos[1] = rightHand[1];
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
          Gun.spawnPoint = [5, -110];
          Gun.type = "pistol";

          ctx.translate(x, y);
          ctx.rotate(-5 * Math.PI / 180);
          ctx.translate(-x, -y);

          ctx.beginPath();
          ctx.rect(x + 10, y - 50, 5, -45); //glock 19 is squared.

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;

        case "ar_15":
          Gun.spawnPoint = [5, -125];
          Gun.type = "rifle";

          ctx.beginPath();
          ctx.ellipse(x + 10, y - 75, 5, 45, -5 * Math.PI/180, 0, 2 * Math.PI);

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;

        case "remington_870":
          Gun.spawnPoint = [0, -125];
          Gun.type = "shotgun";

          ctx.beginPath();
          ctx.ellipse(x + 6, y - 75, 7, 30, -5 * Math.PI/180, 0, 2 * Math.PI);

          ctx.stroke();
          ctx.fill();

          ctx.translate(x, y);
          ctx.rotate(-5 * Math.PI / 180);
          ctx.translate(-x, -y);

          ctx.beginPath();
          ctx.rect(x + 10, y - 50, 5, -75); //glock 19 is squared.

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;
      }
    }
  },

  drawAmmoAmount: function () {
    let text = "AIRSOFT PELLETS LEFT: " + Player.ammo;
    ctx.font = "15px Courier";
    ctx.textAlign = "end";
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.fillText(text, canvas.width - 15, 25);
  },

  drawHealth: function () {
    let text = "HEALTH: " + Player.health + "%";
    ctx.font = "15px Courier";
    ctx.textAlign = "start";
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.fillText(text, 15, 25);
  },

  drawAll: function (x, y, rotation, name, inventoryItem) {
    x = x - Map.translateView[0]; //augmented by player's view
    y = y - Map.translateView[1];

    var gun = HudItem.determineGun(inventoryItem); //returns object. bool = true, hands = 1, or 2

    this.drawGun(x, y, rotation, inventoryItem);

    Game.drawBullets();

    this.drawPerson(x, y);

    this.drawHands(x, y, rotation, gun);

    this.drawAmmoAmount();

    this.drawHealth();

    if (name != Player.name) { this.drawName(x, y, name); }
  },

  updateInventory: function () {
    $(".hudSlot").each(function( index ) {
      if (Player.inventory[index] != "empty") {
        //$("#hudSlot" + index).html("<img src='/images/inventory/" + Player.inventory[index] + ".ico' class='hudSlotImage'>");
        $("#hudSlot" + index).html("<img src='/images/inventory/" + Player.inventory[index] + ".png' class='hudSlotImage' />");
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
      if (this.lastMove < Date.now()) {
        this.moveMargin = (Date.now() - this.lastMove) / 16;

        this.x += x * this.moveMargin; //changes coordinates on the client side. (absolute coords)
        this.y += y * this.moveMargin;

        //tell server that you moved
        if (x != 0 || y != 0) { //if movement doesn't equal the last coordinates
          this.moveServerPlayer();

          if (Player.center === true) {
            Map.translateView[0] += x * this.moveMargin;
            Map.translateView[1] += y * this.moveMargin;
          }
        }
        this.lastMove = Date.now();
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
      Map.translateView[1] += playerSpeed * this.moveMargin; //decleared in game.js
    }

    if (AugmentedPlayer.coords[0] > canvasEdge[1]) { // stops at right edge
      Map.translateView[0] += playerSpeed * this.moveMargin;
    }

    if (AugmentedPlayer.coords[1] < canvasEdge[2]) { // stops at bottom edge
      Map.translateView[1] -= playerSpeed * this.moveMargin;
    }

    if (AugmentedPlayer.coords[0] < canvasEdge[3]) { // stops at left edge
      Map.translateView[0] -= playerSpeed * this.moveMargin;
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
  },

  shoot: function (rotation) {
    let x = this.x;
    let y = this.y;

    let expires = 50; //default settings..
    let velocity = 10;

    let pos = getPoint(x, y, x + Gun.spawnPoint[0], y + Gun.spawnPoint[1], rotation);

    if (HudItem.determineGun(Player.inventory[HudItem.selectedItem]).bool === true && Player.ammo > 0) {

      let ammoAmount = 1; //the ammount of ammo used by each gun
      let shot = false;

      switch (Gun.type) {
        case "pistol":
          expires = 100;
          var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires); //single bullet
          shot = true;
          break;

        case "rifle":
          expires = 400;
          velocity = 20;
          var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires); //single bullet
          shot = true;
          break;

        case "shotgun":
          ammoAmount = 5;
          expires = 100;

          if (Player.ammo >= ammoAmount) {
            let bullets = 0;
            while (bullets < 10) {
              var randomRotation = Math.random() * 7 - 3;
              var randomVelocity = Math.random() * 5;
              new Game.bullet(pos.x, pos.y, rotation + randomRotation, velocity + randomVelocity, expires); //single bullet
              bullets++;
            }

            shot = true;
          }
          break;
      }

      if (shot === true) {
        Player.ammo -= ammoAmount;
      }
    }
  },

  gotShot: function (velocityOfBullet) {
    this.health -= velocityOfBullet / 2;

    App.game.send_player_health(this.health);

    Animation.hurtDraw = true;
  },

  detectCollision: function (object1, object2, object1Width, object1Height, object2Width, object2Height) {
    let touching = false;

    if (object1[0] < object2[0] + object2Width  && object1[0] + object1Width  > object2[0] &&
    object1[1] < object2[1] + object2Height && object1[1] + object1Height > object2[1]) {
      touching = true;
    }

    return touching;
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
});

$("#canvas").click(function () {
    Player.shoot(Player.rotation);
});

canvas.addEventListener('mousedown', function(e){ e.preventDefault(); }, false);

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
    case 70:
      keyF = true;
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

    Player.moveServerPlayer();
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
    case 70:
      keyF = false;
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
var keyF = false;

//for HUD
var key1 = false;
var key2 = false;
var key3 = false;
var key4 = false;
var key5 = false;
var key6 = false;
var key7 = false;
var key8 = false;