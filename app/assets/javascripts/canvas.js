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


ctx = Context.context; //important shorthand notice


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

        ctx.beginPath();
        ctx.fillStyle = '#72a958';
        ctx.rect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fill();

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