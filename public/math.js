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

var bunkers = [];

function calculateBulletRicochetAngle (angleOfBullet, angleOfObject) {
	if (angleOfObject == "vertical") {
		angleOfBullet *= -1;
	}
	if (angleOfObject == "horizontal") {
		angleOfBullet *= -1;
		angleOfBullet += 180;
	}

	return angleOfBullet;
}

bunker_texture = new Image();
bunker_texture.src = '/images/bunker_texture.png';

tile_wood_floor_texture = new Image();
tile_wood_floor_texture.src = '/images/tile_wood_floor_texture.png';

var Bunker = {

	square: function (x, y) {
		bunkers.push({
			x: x,
			y: y,
			width: 15,
			height: 250,
			alignment: "vertical",
			type: "bunker"
		},

		{
			x: x,
			y: y,
			width: 250,
			height: 15,
			alignment: "horizontal",
			type: "bunker"
		},
		
		{
			x: x + 250,
			y: y,
			width: 15,
			height: 250,
			alignment: "vertical",
			type: "bunker"
		},

		{
			x: x,
			y: y + 250,
			width: 70,
			height: 15,
			alignment: "horizontal",
			type: "bunker"
		},

		{
			x: x + 265 - 70,
			y: y + 250,
			width: 70,
			height: 15,
			alignment: "horizontal",
			type: "bunker"
		});
	},

	house: function (x, y) {
		bunkers.push({
			x: x + 15,
			y: y + 15,
			width: 500 - 15,
			height: 500 - 15,
			alignment: "none",
			type: "tile_wood_floor",
			collision: false
		},

		{
			x: x,
			y: y,
			width: 500,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x,
			y: y,
			width: 15,
			height: 500,
			alignment: "vertical",
			type: "bunker",
			collision: true
		},

		{
			x: x,
			y: y + 500,
			width: 515,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x + 500,
			y: y,
			width: 15,
			height: 400,
			alignment: "vertical",
			type: "bunker",
			collision: true
		});
	},

	house_opposite: function (x, y) {
		bunkers.push({
			x: x + 15,
			y: y + 15,
			width: 500 - 15,
			height: 500 - 15,
			alignment: "none",
			type: "tile_wood_floor",
			collision: false
		},

		{
			x: x,
			y: y,
			width: 500,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x + 500,
			y: y,
			width: 15,
			height: 500,
			alignment: "vertical",
			type: "bunker",
			collision: true
		},

		{
			x: x,
			y: y + 500,
			width: 515,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x,
			y: y,
			width: 15,
			height: 400,
			alignment: "vertical",
			type: "bunker",
			collision: true
		});
	},

	house_facing_up: function(x, y) {
		bunkers.push({
			x: x + 15,
			y: y + 15,
			width: 500 - 15,
			height: 500 - 15,
			alignment: "none",
			type: "tile_wood_floor",
			collision: false
		},

		{
			x: x,
			y: y,
			width: 200,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x + 300,
			y: y,
			width: 200,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x + 500,
			y: y,
			width: 15,
			height: 500,
			alignment: "vertical",
			type: "bunker",
			collision: true
		},

		{
			x: x,
			y: y + 500,
			width: 515,
			height: 15,
			alignment: "horizontal",
			type: "bunker",
			collision: true
		},

		{
			x: x,
			y: y,
			width: 15,
			height: 500,
			alignment: "vertical",
			type: "bunker",
			collision: true
		});
	},

	drawAll: function () {
		bunkers.forEach(function (element, index) {
			ctx.beginPath();
			ctx.fillStyle = "black";

			let x_augmented = element.x - Map.translateView[0];
			let y_augmented = element.y - Map.translateView[1];
			switch (element.type) {
				case "bunker":
					var pattern = ctx.createPattern(bunker_texture,"repeat");
					ctx.fillStyle = pattern;
				break;

				case "tile_wood_floor":
					var pattern = ctx.createPattern(tile_wood_floor_texture,"repeat");
					ctx.fillStyle = pattern;
				break;
			}

			ctx.rect(x_augmented, y_augmented, element.width, element.height);

			ctx.translate(x_augmented, y_augmented);

			ctx.fill();

			ctx.resetTransform();
		});
	},

	drawServerBunkers: function (bunkersArray) {
		//coffeescript calls this function

		bunkersArray.forEach(function (element, index) {
			let x = bunkersArray[index][0];
			let y = bunkersArray[index][1];

			switch (bunkersArray[index][2]) {
				case "square":
				Bunker.square(x, y);
				break;

				case "house":
				Bunker.house(x, y);
				break;

				case "house1":
				Bunker.house_opposite(x, y);
				break;

				case "house2":
				Bunker.house_facing_up(x, y);
				break;
			}
		});
	}
};




