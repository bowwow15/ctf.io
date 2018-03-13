window.addEventListener(
    'load',
    function () {
        var canvas = document.getElementsByTagName('canvas')[0];

        fullscreenify(canvas);
    },
    false
);

function fullscreenify(canvas) {
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function () {resize(canvas);}, false);

    resize(canvas);

    function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;
        
        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}