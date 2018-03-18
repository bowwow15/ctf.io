

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

//images
var bullet_trail_img = new Image();   // Create new img element
bullet_trail_img.src = '/images/sprites/bullet_trail.png'; // Set source path
var glock_19_img = new Image();
glock_19_img.src = '/images/inventory/glock_19.png';
var ar_15_img = new Image();
ar_15_img.src = '/images/inventory/ar_15.png';
var ak_47_img = new Image();
ak_47_img.src = '/images/inventory/ak_47.png';
var remington_870_img = new Image();
remington_870_img.src = '/images/inventory/remington_870.png';
var mac_11_img = new Image();
mac_11_img.src = '/images/inventory/mac_11.png';
var barrett_m82a1_img = new Image();
barrett_m82a1_img.src = '/images/inventory/barrett_m82a1.png';
var the_orion_img = new Image();
the_orion_img.src = '/images/inventory/the_orion.png';

var ammo_img = new Image();
ammo_img.src = '/images/inventory/ammo.png';

var the_orion_top_img = new Image();
the_orion_top_img.src = '/images/guns/the_orion_top.png';

//audio
var gunshot_rifle_audio = new Audio('/audio/rifle.mp3');
var gunshot_50_bmg_audio = new Audio('/audio/50_bmg.mp3');
var gunshot_shotgun_audio = new Audio('/audio/shotgun.mp3');
var gunshot_pistol_audio = new Audio('/audio/pistol.mp3');
var gunshot_assault_rifle_audio = new Audio('/audio/assault_rifle.mp3');
var gunshot_the_orion_audio = new Audio('/audio/the_orion.mp3');

var dry_fire_audio = new Audio('/audio/dry_fire.mp3');


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
    ctx.textAlign="start";
    this.droppedItems.forEach(function (element, index) {
      let x = element[0] - Map.translateView[0];
      let y = element[1] - Map.translateView[1];
      let name = element[2];

      if (name != false) {
        ctx.beginPath();
        ctx.arc(x - (45 / 2), y + (45 / 2), (30), 0, 2*Math.PI);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.drawImage(eval(name + "_img"), x - eval(name + "_img").width, y - 2.5);
      }

      let textCollision = Player.detectCollision([element[0] - 30, element[1] + 15], [Player.x, Player.y], 60, 60, Player.size, Player.size);

      if (textCollision === true) {
        let x_augmented = Player.x - Map.translateView[0] + 50;
        let y_augmented = Player.y - Map.translateView[1] - 50;

        ctx.beginPath();
        ctx.font="30px Courier";
        ctx.fillStyle='black';
        ctx.fillText(name, x_augmented, y_augmented - 50);
        ctx.fillText("Press F to pick up", x_augmented, y_augmented);

        if (keyF === true) {
          Map.pickUpItem(index);
          keyF = false;
        }
      }
    });
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
  ricoshetNoBlur: 0,

  draw: function (fps) {
    // drawGrid();

    App.game.move_player([Player.x, Player.y]); //tell server your coordinates

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    drawContent(); //referenced below... somewhere.

    // used for debugging: eval(prompt("function"));
  },

  playAudio: function (audio, x, y, audioFromServer = false) {
    if (audioFromServer === false) {
      App.game.play_audio([audio, x, y]);
    }
    else {
      audio = eval(audio); //turns string into variable

      //calculate distance from sound to player
      let audioDistance = eval(1 - (Math.abs(x - Player.x) / (500 / 2)) + (Math.abs(y - Player.y) / (500 / 2)));

      if (audioDistance > 1) audioDistance = 1;

      audio.volume = audioDistance;

      if (window.chrome) audio.load();

      audio.cloneNode(true).play();
    }
  },

  drawCoords: function () {
    //draw coordinates here...
  },

  addGraveStone: function (player) {
    x = player[0] - Map.translateView[0];
    y = player[1] - Map.translateView[1];
  },

  bullet: function (x, y, rotation, velocity, expires, blur = true, player_uuid, damage = 1, until_next_ricochet = 0, dontShootYourselfTimer = 5) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;

    App.game.shoot([x, y, rotation, velocity, expires, blur, player_uuid, until_next_ricochet, dontShootYourselfTimer, damage]);

    //Game.bullets.push([x, y, rotation, velocity, expires]);
    //not using above code because it is already declared in global.coffee
  },

  deleteBullet: function (index) {
    x = Game.bullets[index][0];
    y = Game.bullets[index][1];

    Game.bullets.splice(index, 1); //deletes bullet

    //to do: draw bullet splash
  },

  detectTreeCollision: function (x, y, x_velocity, y_velocity) {
    treeCollision = {};
    BreakException = {};

    try { //detects bullet collisions for each bunker
      trees.forEach(function (element, index) {
        treeCollision = Player.detectCollision([x + x_velocity, y + y_velocity], [trees[index].x + 130, trees[index].y + 130], Math.abs(x_velocity), Math.abs(y_velocity), 40, 40);

        if (treeCollision === true) throw BreakException;
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return treeCollision;
  },

  drawBullets: function () {
    Game.bullets.forEach(function (element, index) {
      var expires = element[4];
      var velocity = element[3] * 3;
      let x = element[0];
      let y = element[1];
      var blur = element[5];
      var bulletUuid = element[6];
      var ricoshetDistanceToCompensateBlur = {
        x: 0,
        y: 0
      }; //distance to remove the extra blur...

      var rotation = element[2] - 90;

      x_velocity = (velocity - ricoshetDistanceToCompensateBlur.x) * Math.cos(rotation * Math.PI / 180); //calculate direction of bullet
      y_velocity = (velocity - ricoshetDistanceToCompensateBlur.y) * Math.sin(rotation * Math.PI / 180);

      //detect bullet collisions
      let bulletCollision = Player.detectCollision([x + Player.size, y + Player.size], [Player.x, Player.y], Math.abs(x_velocity), Math.abs(y_velocity), Player.hitBox.width, Player.hitBox.height);
        
      var bunkerCollision = {};
      var BreakException = {};

      try { //detects bullet collisions for each bunker
        bunkers.forEach(function (element, index) {
          bunkerCollision = {
            bool: Player.detectCollision([x + x_velocity, y + y_velocity], [bunkers[index].x, bunkers[index].y], Math.abs(x_velocity), Math.abs(y_velocity), bunkers[index].width, bunkers[index].height),
            alignment: bunkers[index].alignment
          };

          if (bunkerCollision.bool === true && bunkers[index].collision != false) throw BreakException;
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }

      let treeCollision = Game.detectTreeCollision(x, y, x_velocity, y_velocity);

      if (treeCollision === true) {
        App.global.delete_bullet(index); //tells server to delete bullet

        //make bark particle effect
        //coming soon

        return;
      }

      element[8] -= 1; //DONTSHOOTYOURSELFTIMER

      if (bulletCollision === true) {
        //if bullet isn't your own...
        if (bulletUuid != Player.self_uuid || element[8] < 1) { //element[4] is expires
          App.global.delete_bullet(index); //tells server to delete bullet

          Player.gotShot(velocity, element[6], element[9]);
        }
      }

      if (expires > 0) {
        Game.bullets[index][4] -= velocity / 10;

        //if bullet is set to ricochet...
        if (bunkerCollision.bool === true && Game.bullets[index][7] <= 0) { //game.bullets[index][7] determines if the bullet already ricosheted.
          //bullet ricoshets
          Game.ricoshetNoBlur = 3;

          Game.bullets[index][2] = calculateBulletRicochetAngle(Game.bullets[index][2], bunkerCollision.alignment);
          Game.bullets[index][7] = 0; //0 frames until the next ricochet

          ricoshetDistanceToCompensateBlur = {
            x: 65,
            y: 65
          }; //distance to remove the extra blur...

          if (bunkerCollision.alignment == "vertical") {
            ricoshetDistanceToCompensateBlur.y = 0;
          }
          else {
            ricoshetDistanceToCompensateBlur.x = 0;
          }
        }

        //reinstate variables below, augmented by (Object) ricoshetDistanceToCompensateBlur
        x_velocity = (velocity - ricoshetDistanceToCompensateBlur.x) * Math.cos(rotation * Math.PI / 180); //calculate direction of bullet
        y_velocity = (velocity - ricoshetDistanceToCompensateBlur.y) * Math.sin(rotation * Math.PI / 180);

        Game.bullets[index][0] += x_velocity;
        Game.bullets[index][1] += y_velocity;

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

        Game.bullets[index][7] -= 1;

        if (Game.ricoshetNoBlur > 0) { Game.ricoshetNoBlur -= 1; } //take away one each time
      }
      else {
        Game.bullets.splice(index, 1); //deletes bullet
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

  select: function (index) {
    //selects item from HTML HUD
    if (index != this.selectedItem) { //that would deselect the HUD item... don't do that
      document.getElementById("hudSlot" + index).classList.add('hudSelected');
      document.getElementById("hudSlot" + this.selectedItem).classList.remove('hudSelected'); //removes class from deselected item
      this.selectedItem = index;
    }

    $("#hudStatus").show();
    $("#hudStatus").html(Player.inventory[index]);
    window.setTimeout(function () {
      $("#hudStatus").fadeOut(500);
    }, 5000);
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
      case "mac_11":
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


var Player = {
  size: 40,
  hitBox: {
    width: 80,
    height: 80
  },
  rotation: 0,
  speed: 3,
  lastMove: Date.now(),
  lastPlayerThatDeltDamage: null,
  moveMargin: 0,
  handPos: [0, 0],
  ammo: 0,
  shootAgain: [false, 0],
  health: 100,
  maxHealth: 100,
  lastRegen: 0,
  dead: false,
  kills: 0,
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

    ctx.strokeStyle = '#4b2f02';
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

        case "mac_11":
          Gun.spawnPoint = [5, -110];
          Gun.type = "assault_rifle";

          ctx.strokeStyle = "black";
          ctx.fillStyle = "#262626";

          ctx.translate(x, y);
          ctx.rotate(-5 * Math.PI / 180);
          ctx.translate(-x, -y);

          //silencer
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 7;
          ctx.rect(x + 12.5, y - 90, 0.5, -30);
          ctx.stroke();

          ctx.beginPath();
          ctx.rect(x + 10, y - 50, 5, -45); //mac 11 is squared.

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
          ctx.rect(x + 10, y - 50, 5, -75);

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;

        case "ak_47":
          Gun.spawnPoint = [0, -125];
          Gun.type = "assault_rifle";

          ctx.fillStyle = "#994d00";
          ctx.strokeStyle = "#4d2600";
          ctx.beginPath();
          ctx.ellipse(x + 6, y - 75, 7, 30, -5 * Math.PI/180, 0, 2 * Math.PI);

          ctx.stroke();
          ctx.fill();

          ctx.translate(x, y);
          ctx.rotate(-5 * Math.PI / 180);
          ctx.translate(-x, -y);

          //barrel of ak
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.fillStyle = "#262626";
          ctx.rect(x + 11.5, y - 50, 3, -75);

          ctx.stroke();
          ctx.fill();

          //iron sight
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 1;
          ctx.rect(x + 12.5, y - 120, 0.5, -5);
          ctx.stroke();

          ctx.resetTransform();
        break;

        case "barrett_m82a1":
          Gun.spawnPoint = [-2, -175];
          Gun.type = "50_bmg";

          ctx.translate(x, y);
          ctx.rotate(-5 * Math.PI / 180);
          ctx.translate(-x, -y);

          ctx.beginPath();
          ctx.rect(x + 9, y - 40, 7, -85); //barret is squared.

          ctx.stroke();
          ctx.fill();

          //barrel of barret
          ctx.beginPath();
          ctx.strokeStyle = "#262626";
          ctx.fillStyle = "#262626";
          ctx.rect(x + 13, y - 50, 0, -135);

          ctx.stroke();
          ctx.fill();
          ctx.resetTransform();
        break;

        case "the_orion":
          Gun.spawnPoint = [5, -108];
          Gun.type = "the_orion";

          ctx.translate(x, y);
          ctx.rotate(-5 * Math.PI / 180);
          ctx.translate(-x, -y);

          ctx.beginPath();
          ctx.drawImage(the_orion_top_img, x + 9, y - 150); 

          //the_orion_top_img
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

  healthRegen: function (rateOfRegeneration) {
    if (Date.now() - rateOfRegeneration > this.lastRegen) {
      this.lastRegen = Date.now();

      if (this.health < this.maxHealth) {
        this.health += 1;
      }
    }
  },

  drawKills: function () {
    let text = "KILLS: " + Player.kills;
    ctx.font = "15px Courier";
    ctx.textAlign = "end";
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.fillText(text, canvas.width - 15, 45);
  },

  registerPoint: function () {
    if (Player.kills == 10) {
      App.game.add_to_inventory("the_orion");
    }
  },

  updateInventory: function () {
    $(".hudSlot").each(function( index ) {
      if (Player.inventory[index] != "empty") {
        //$("#hudSlot" + index).html("<img src='/images/inventory/" + Player.inventory[index] + ".ico' class='hudSlotImage'>");
        $("#hudSlot" + index).html("<img src='/images/inventory/" + Player.inventory[index] + ".png' class='hudSlotImage' />");
      }
      else {
        $("#hudSlot" + index).html("");
      }
    });
  },

  addToInventory: function (inventory) {

    inventory.forEach(function (element, index) { //automatically adds ammo to ammo count
      if (inventory[index] == "ammo") {
        Player.ammo += 25;

        //plays ammo sound effect


        inventory[index] = "empty";

        App.game.drop_from_inventory([Player.x, Player.y, index]);
      }
    });

    Player.inventory = inventory;
    Player.updateInventory();
  },

  dropItem: function () {
    if (HudItem.selectedItem != "empty") {
      App.game.drop_from_inventory([Player.x, Player.y, HudItem.selectedItem]);
      this.updateInventory();
    }
  },

  mapEdgeDetect: function (x, y) {
    var move = true; //sets default
    var edgeStop = 25; //margin that player stops from edge of map

    //check if near the edge of map
    if (x < 0) { //moving left
      if (this.x < 0 + this.size + edgeStop) {
        x = 0;
      }
    }
    if (x > 0) { //moving right
      if (this.x > Map.mapLimit[0] - this.size - edgeStop) {
        x = 0;
      }
    }
    if (y < 0) { //moving up
      if (this.y < 0 + this.size + edgeStop) {
        y = 0;
      }
    }
    if (y > 0) { //moving down
      if (this.y > Map.mapLimit[1] - this.size - edgeStop) {
        y = 0;
      }
    }

    return {
      x: x,
      y: y
    };
  },

  moveServerPlayer: function () {
    App.game.move_player([this.x, this.y, this.rotation, this.inventory[HudItem.selectedItem]]);
  },

  detectCollision: function (object1, object2, object1Width, object1Height, object2Width, object2Height) {
    let touching = false;

    if (object1[0] < object2[0] + object2Width  && object1[0] + object1Width  > object2[0] &&
    object1[1] < object2[1] + object2Height && object1[1] + object1Height > object2[1]) {
      touching = true;
    }

    return touching;
  },

  objectCollisionDetect: function (x, y, x_velocity, y_velocity) {
    var BreakException = {};
    let playerBunkerCollision = {};

    try { //detects bullet collisions for each bunker
      bunkers.forEach(function (element, index) {
        playerBunkerCollision = {
          bool: Player.detectCollision([x - Player.size, y - Player.size], [bunkers[index].x, bunkers[index].y], Player.hitBox.width + x_velocity, Player.hitBox.height + y_velocity, bunkers[index].width, bunkers[index].height),
          alignment: bunkers[index].alignment
        };

        if (playerBunkerCollision.bool === true && bunkers[index].collision != false) throw BreakException;
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return playerBunkerCollision.bool;
  },

  move: function (x, y) {
    this.lastCoordinates = [this.x, this.y]; //in case we need to go back
    var move = true; //sets default

    x = this.mapEdgeDetect(x, y).x; //map edge detection first...
    y = this.mapEdgeDetect(x, y).y;

    if (this.objectCollisionDetect(Player.x + x, Player.y, x, y) === true) { //then object detection
      x = 0;
    }

    if (this.objectCollisionDetect(Player.x, Player.y + y, x, y) === true) {
      y = 0;
    }

    if (this.lastMove < Date.now()) {
      if (move === true) {
        this.moveMargin = (Date.now() - this.lastMove) / 16;

        this.x += x * this.moveMargin; //changes coordinates on the client side. (absolute coords)
        this.y += y * this.moveMargin;

        //tell server that you moved
        if (x != 0 || y != 0) { //if movement doesn't equal the last coordinates
          this.moveServerPlayer();

          if (Player.center === true && move === true) {
            Map.translateView[0] += x * this.moveMargin;
            Map.translateView[1] += y * this.moveMargin;
          }
        }
      }
      this.lastMove = Date.now();
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
    if (this.dead != true) { //don't die if you're already dead
      this.dead = true;

      App.game.player_die(Player.lastPlayerThatDeltDamage);

      cancelAnimationFrame(drawContentAnimation);

      //displays death screen
      $("#deathscreen").fadeIn(1000);

      document.getElementById('deathscreen').style.backgroundColor = "black";
    }
  },

  shoot: function (rotation, bulletIncrementFrequency = 100) {

    function dryFire () {
        Game.playAudio("dry_fire_audio", Player.x, Player.y, true);
        Player.shootAgain[0] = false;
    }

    let x = this.x;
    let y = this.y;

    let expires = 50; //default settings..
    let velocity = 10;

    let pos = getPoint(x, y, x + Gun.spawnPoint[0], y + Gun.spawnPoint[1], rotation);

    if (HudItem.determineGun(Player.inventory[HudItem.selectedItem]).bool) {
      if (Player.ammo > 0) {

        var ammoAmount = 1; //the ammount of ammo used by each gun
        var shot = false;
        let damage = 1;

        switch (Gun.type) {
          case "pistol":
            this.shootAgain = [false, 0];
            expires = 100;

            Game.playAudio("gunshot_pistol_audio", Player.x, Player.y);

            var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid); //single bullet
            shot = true;
            break;

          case "rifle":
            this.shootAgain = [false, 0];
            expires = 400;
            velocity = 20;
            damage = 2;
            
            Game.playAudio("gunshot_rifle_audio", Player.x, Player.y);

            var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid, damage); //single bullet
            shot = true;
            break;

          case "assault_rifle":
            expires = 400;
            velocity = 15;

            Game.playAudio("gunshot_assault_rifle_audio", Player.x, Player.y);

            var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid); //single bullet

            if (mouseDown == 1) {
              if (Player.shootAgain[0] === false) {
                Player.shootAgain = [true, Date.now() + bulletIncrementFrequency, Gun.type]; // 10 milliseconds
              }
              else {
                if (Player.shootAgain[1] < Date.now()) {
                  Player.shootAgain = [true, Date.now() + bulletIncrementFrequency, Gun.type]; // 10 milliseconds
                  var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid);
                }
              }
            }
            else {
              Player.shootAgain = [false, 0];
            }

            shot = true;
            break;

          case "shotgun":
            this.shootAgain = [false, 0];
            ammoAmount = 5;
            expires = 100;

            if (Player.ammo >= ammoAmount) {
              let bullets = 0;
              while (bullets < 10) {
                var randomRotation = Math.random() * 7 - 3;
                var randomVelocity = Math.random() * 5;
                new Game.bullet(pos.x, pos.y, rotation + randomRotation, velocity + randomVelocity, expires, true, this.self_uuid); //single bullet
                bullets++;
              }

              Game.playAudio("gunshot_shotgun_audio", Player.x, Player.y);
              shot = true;
            }
            break;

            case "50_bmg":
              this.shootAgain = [false, 0];
              expires = 800;
              velocity = 50;
              damage = 10;
              ammoAmount = 10; //takes 10 bullets to fire

              if (Player.shootAgain[1] < Date.now()) {
                if (Player.ammo >= ammoAmount) {
                  Game.playAudio("gunshot_50_bmg_audio", Player.x, Player.y);

                  var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid, damage); //single bullet
                  shot = true;
                }
              }
              this.shootAgain[1] = Date.now() + 100;
              break;

            case "the_orion":
              expires = 800;
              velocity = 50;
              damage = 10;
              Game.playAudio("gunshot_the_orion_audio", Player.x, Player.y);

              var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid, damage); //single bullet

              if (mouseDown == 1) {
                if (Player.shootAgain[0] === false) {
                  Player.shootAgain = [true, Date.now() + bulletIncrementFrequency, Gun.type]; // 10 milliseconds
                }
                else {
                  if (Player.shootAgain[1] < Date.now()) {
                    Player.shootAgain = [true, Date.now() + bulletIncrementFrequency, Gun.type]; // 10 milliseconds
                    var bullet = new Game.bullet(pos.x, pos.y, rotation, velocity, expires, true, this.self_uuid, damage);
                  }
                }
              }
              else {
                Player.shootAgain = [false, 0];
              }

              shot = true;
              break;
        }
      }

      else { //dry fire
        dryFire();
      }

      if (shot === false) {
        dryFire();
      }

      if (shot === true) {
        Player.ammo -= ammoAmount;
      }
    }
  },

  shootAuto: function () {
    if (mouseDown == 1 && Player.shootAgain[0] === true) {
      if (Date.now() > Player.shootAgain[1]) {
        Player.shoot(Player.rotation);
      }
    }
  },

  gotShot: function (velocityOfBullet, player_uuid, damage) {
    this.lastPlayerThatDeltDamage = player_uuid;

    this.health -= (velocityOfBullet / 10) * damage;

    App.game.send_player_health(this.health);

    Animation.hurtDraw = true;
  },

  drawAll: function (x, y, rotation, name, inventoryItem) {
    x = x - Map.translateView[0]; //augmented by player's view
    y = y - Map.translateView[1];

    var gun = HudItem.determineGun(inventoryItem); //returns object. bool = true, hands = 1, or 2

    Obsticle.drawAll();

    Map.drawDroppedItems();

    Game.drawBullets();

    //loads server players...
    Object.keys(OnlinePlayers).forEach(function (uuid) { //draws all players on server
      if (uuid != Player.self_uuid) { // if the player isn't your own
        Player.drawAllOnline(OnlinePlayers[uuid][0], OnlinePlayers[uuid][1], OnlinePlayers[uuid][2], OnlinePlayers[uuid + "_name"], OnlinePlayers[uuid][3]); //OnlinePlayers["(uuid)"] = [coordinates, rotation, player name, inventory item]
      }
    });

    this.drawGun(x, y, rotation, inventoryItem);
    
    this.drawPerson(x, y);

    this.drawHands(x, y, rotation, gun);

    Obsticle.drawTrees();

    this.drawAmmoAmount();

    this.drawHealth();

    this.drawKills();

    this.shootAuto();

    this.healthRegen(2000);
  },

  drawAllOnline: function (x, y, rotation, name, inventoryItem) {
    x = x - Map.translateView[0]; //augmented by player's view
    y = y - Map.translateView[1];

    var gun = HudItem.determineGun(inventoryItem); //returns object. bool = true, hands = 1, or 2

    this.drawGun(x, y, rotation, inventoryItem);

    this.drawPerson(x, y);

    this.drawHands(x, y, rotation, gun);

    this.drawName(x, y, name);
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


var mouseDown = 0;
document.getElementById('canvas').onmousedown = function() { 
  mouseDown = 1;

  if (Player.shootAgain[0] == true) {
    Player.shoot(Player.rotation, true);
  }
  else {
    Player.shoot(Player.rotation);
  }
}

document.getElementById('canvas').onmouseup = function() {
  mouseDown = 0;
}

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
    case 81:
      keyQ = true;
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

  if (keyQ === true) {
    Player.dropItem();
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
    case 81:
      keyQ = false;
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
var keyQ = false;

//for HUD
var key1 = false;
var key2 = false;
var key3 = false;
var key4 = false;
var key5 = false;
var key6 = false;
var key7 = false;
var key8 = false;