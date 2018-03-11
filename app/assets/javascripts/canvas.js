var GameCanvas;

//CANVAS JS BELOW
var Context = {
  canvas: null,
  context: null,

  create: function (canvas_tag_id) {
    this.canvas = document.getElementById(canvas_tag_id); // Initializes canvas by element ID
    this.context = this.canvas.getContext('2d'); // 2 dimentional canvas
  }
};

var ctx;

ctx = Context.context; //important shorthand notice


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


// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

var SplashScreen = {
	draw: function () {

	    drawGrid(200, 200, Map.mapLimit[0], Map.mapLimit[1]);

	    //Title
	    ctx.beginPath(); //resets path that is being drawn.
	    ctx.fillStyle = '#527a3f';
	    ctx.strokeStyle = '#456736';

	    ctx.font = "100px Arial";
	    ctx.textAlign="center";

	    ctx.fillText("CTF.io", canvas.width / 2, canvas.height / 2 + 50);
	    ctx.strokeText("CTF.io", canvas.width / 2, canvas.height / 2 + 50); 
		}
}

function resizeCanvas () { //resizes canvas to browser window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //draws background
        if (ctx === null) {
        	Context.create("canvas");
        	ctx = Context.context;
        }



        GameCanvas = {
			width: canvas.width,
			height: canvas.height
		};

		canvasWidthCenter = canvas.width;
  		canvasHeightCenter = canvas.height / 2;

  		SplashScreen.draw();
}

GameCanvas = {
	width: document.getElementById('canvas').width,
	height: document.getElementById('canvas').height
};


//spread HUD items 5px (css animation)
$(document).ready(function () {
	//initial canvas color

	for (i = 0; i < 8; i++) {
		document.getElementById("hudSlot" + i).classList.add('spread5px');
	}
	
	//animate border-radius
	$( ".hudSlot" ).animate({
	    opacity: 1,
	    borderRadius: 0
	  }, 500, function() {
	    // Animation complete.
	  });

	$( "#hud" ).animate({
	    bottom: 0
	  }, 500, function() {
	    // Animation complete.
	  });

	//animate name inpit
	$( "#name" ).animate({
	    top: 0
	  }, 500, function() {
	    // Animation complete.
	  });
});