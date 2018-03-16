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

var Bunker = {
	test: true,
	square: function (x, y) {
		bunkers.push({
			x: x,
			y: y,
			width: 15,
			height: 250,
			alignment: "vertical"
		},

		{
			x: x,
			y: y,
			width: 250,
			height: 15,
			alignment: "horizontal"
		},
		
		{
			x: x + 250,
			y: y,
			width: 15,
			height: 250,
			alignment: "vertical"
		},

		{
			x: x,
			y: y + 250,
			width: 70,
			height: 15,
			alignment: "horizontal"
		},

		{
			x: x + 265 - 70,
			y: y + 250,
			width: 70,
			height: 15,
			alignment: "horizontal"
		});
	},

	drawAll: function () {
		bunkers.forEach(function (element, index) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			let x_augmented = element.x - Map.translateView[0];
			let y_augmented = element.y - Map.translateView[1];

			var pattern = ctx.createPattern(bunker_texture,"repeat");
			ctx.fillStyle = pattern;

			ctx.rect(x_augmented, y_augmented, element.width, element.height);
			ctx.fill();
		});
	}
};

Bunker.square(10, 10);
