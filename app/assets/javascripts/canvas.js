var GameCanvas;

var Map;

Map = {
  translateView: [0, 0], //used to determine where the screen is viewing on the map... (usage: translateView[x, y])
  spawnPoint: [0, 0] //default
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

ctx = Context.context; //important shorthand notice

var boxesX;
var boxesY;
var drawGrid = function(w, l, maxX, maxY) {
	ctx.strokeStyle = '#629953';
	ctx.lineWidth = 1;
	for (boxesX = 0; (boxesX*w / 2) < maxX; boxesX++) {
		ctx.beginPath();

		ctx.rect(0 - Map.translateView[0] + (boxesX*w / 2), 0 - Map.translateView[1], w, l); // implementing translateView to effect the movement
		ctx.stroke();

		for (boxesY = 0; (boxesY*l / 2) < maxY; boxesY++) {
			ctx.beginPath();

			ctx.rect(0 - Map.translateView[0] + (boxesX*w / 2), 0 - Map.translateView[1] + (boxesY*w / 2), w, l); // implementing translateView to effect the movement
			ctx.stroke();
			boxesY += 1;
		}

		boxesX += 1;
	}
};



// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);



function resizeCanvas () { //resizes canvas to browser window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //draws background
        if (ctx === null) {
        	Context.create("canvas");
        	ctx = Context.context;
        }

        // ctx.beginPath();
        // ctx.fillStyle = '#72a958';
        // ctx.rect(0, 0, window.innerWidth, window.innerHeight);
        // ctx.fill();
        // Not using above code because it was decided to use HTML adn CSS to create a background.


        GameCanvas = {
			width: canvas.width,
			height: canvas.height
		};

		canvasWidthCenter = canvas.width;
  		canvasHeightCenter = canvas.height / 2;
}

GameCanvas = {
	width: document.getElementById('canvas').width,
	height: document.getElementById('canvas').height
};