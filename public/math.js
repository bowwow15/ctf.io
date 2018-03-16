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

var bunkers = [
{
	x: 500,
	y: 500,
	width: 5,
	height: 250,
	alignment: "vertical"
},

{
	x: 500,
	y: 500,
	width: 250,
	height: 5,
	alignment: "horizontal"
},

];

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