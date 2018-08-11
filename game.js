// better framerate stuff
var lastFrameTime = 0;
var timedelta = 0;
var initialframestep = 1000/60;
var framestep;

var bgcolor = 'rgb(20,20,20)';

var epsilon = 10;

//var //bgm;

var muted = false;

var paused = false;
var unpausedByClick = false;
var clickedOnAButton = false;

var me;

function goodmod(x, n) {
     return ((x%n)+n)%n;
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame      ||
        window.webkitRequestAnimationFrame   ||
        window.mozRequestAnimationFrame      ||
        window.oRequestAnimationFrame        ||
        window.msRequestAnimationFrame       ||
        function(callback, element) {
            window.setTimeout(callback, 1000/60);
        };
})();

var directions = {up: 1, right: 2, down: 3, left: 4};
var directionAngles = [ [-Math.PI/2, -1, 0], [0, 0, 0], [Math.PI/2, 0, -1], [Math.PI, -1, -1] ]; // [angle, x-offset, y-offset]
var directionOffsets = [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ];
function cw(dir) {
    return dir % 4 + 1;
}
function ccw(dir) {
    return (((dir - 2) % 4) + 4) % 4 + 1;
}
function oppositedir(dir) {
    return cw(cw(dir));
}

var images = {};

var totalImages = 0;
var loadedImages = 0;

function registerImages(hash, callback) {
    for (key in hash) {
        totalImages += ncolors;
        registerImage(key, hash[key], callback);
    }
}

function registerImage(id, src, callback) {
    //console.log("Registered image:", id, src);
    images[id] = new Image();
    images[id].onload = function() {
        //console.log("loaded",id,"- now generate colors");
        for (var name in colors) {
            var rgb = colors[name].replace(/[^\d,]+/, '').split(',');
            var rgbks = generateColorImage( images[id], rgb, (function(name) { return function(tinted_img) {
                images[id+'//'+name] = new Image();
                images[id+'//'+name].onload = function() {
                    loadedImages ++;
                    //console.log("loaded", id, name, ":", loadedImages, "/", totalImages);
                    if (loadedImages == totalImages) {
                        console.log("OK GO");
                        callback();
                    }
                }
                images[id+'//'+name].src = tinted_img.toDataURL();
            }})(name));
        }
    }
    images[id].src = src;
}

function imagesReady() {
    return totalImages == loadedImages;
}

function deleteObject(name) {
    delete objs[name];
}

function obj(group, imgid, x, y, color) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.dir = 0;
    this.dist = 0;
    this.imgloaded = false;
    this.imgid = imgid;
    this.color = color;
    this.group = group;

    this.changeImage = function(imgid) {
        this.imgid = imgid;
    }

    this.changeColor = function(color) {
        this.color = color;
    }
}

var objs = {};

//var colors = {black: '0,0,0', red: '255,0,0', green: '0,225,0', magenta: '255,235,0', blue: '0,0,255', purple: '200,0,255', magenta: '255,0,255', grey: '100,100,100', pink: '255,0,150'}
var colors = {black: '0,0,0', red: '255,0,0', blue: '0,0,225', magenta: '212,0,115', purple: '200,0,255',
                green: '0,255,0', dkgreen: '109,243,89', grey: '200,200,200', dkgrey: '170,170,170', pink: '255,0,150' };
var ncolors = 0; for (var n in colors) { ncolors ++; }

var mapScale = 2;
var mapWidth = 20;
var mapHeight = 15;
var tileSize = 18;

var ctx;

var keepGoing = true;

var readyToGo = false;

var justStarted = false;

var audiocheck = document.createElement('audio');

function bumpUp(name) {
    var x = objs[name];
    delete objs[name];
    objs[name] = x;
}

ready(function() {
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    var loading = new Image();
    loading.onload = function() {
        ctx.drawImage(loading, 0, 0);
    }
    loading.src = 'loading.png';
    registerImages({
        char: 'char.png',
        box: 'box.png',
        wall: 'wall.png',
    }, function() {
        if (audiocheck.canPlayType('audio/mpeg')) {
            //bgm = new Audio('walkabout.mp3');
        } else if (audiocheck.canPlayType('audio/ogg')) {
            //bgm = new Audio('walkabout.ogg');
        }
        //bgm.loop = true;
        initialize();
        loop();
    });
});

var score = 0;

var lives = 5;

function initialize() {
    framestep = initialframestep;

    objs = {};

    objs.me = [ new obj('char', 'char', Math.floor(mapWidth/2), Math.floor(mapHeight/2), 'green') ];
    objs.me.slidy = true; // slidy allows it to have fractional coordinates
    me = objs.me[0]; // shorter name for ungrouped object (objects are in lists for snakes and whatnot that take up multiple tiles)
    me.movedir = 0; // direction we're currently sliding in

    objs.boxes = [  new obj('boxes', 'box', Math.floor(mapWidth/2)+1, Math.floor(mapHeight/2), 'pink'),
                    new obj('boxes', 'box', Math.floor(mapWidth/2)+2, Math.floor(mapHeight/2), 'pink'),
                    new obj('boxes', 'box', Math.floor(mapWidth/2)+3, Math.floor(mapHeight/2), 'pink'),
                    new obj('boxes', 'box', Math.floor(mapWidth/2)+4, Math.floor(mapHeight/2), 'pink'),
                    new obj('boxes', 'box', Math.floor(mapWidth/2)+5, Math.floor(mapHeight/2), 'pink'),
                 ];
    objs.boxes.slidy = true;

    objs.walls = [  new obj('walls', 'wall', Math.floor(mapWidth/2)+1, Math.floor(mapHeight/2)+1, 'grey'),
                    new obj('walls', 'wall', Math.floor(mapWidth/2)+2, Math.floor(mapHeight/2)+1, 'grey'),
                    new obj('walls', 'wall', Math.floor(mapWidth/2)+3, Math.floor(mapHeight/2)+1, 'grey'),
                    new obj('walls', 'wall', Math.floor(mapWidth/2)+4, Math.floor(mapHeight/2)+1, 'grey'),
                    new obj('walls', 'wall', Math.floor(mapWidth/2)+5, Math.floor(mapHeight/2)+1, 'grey'),
                 ];

    readyToGo = true;
}

function randomColor() {
    var keys = [];
    for (var prop in colors) {
        if (colors.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }

    var result;
    do {
        result = keys[keys.length * Math.random() << 0];
    } while (result == 'black' || result == 'grey' || result == 'white');
    return result;
}

var inputQueue = []

function unGameOver() {
    console.log("hi");
    //bgm.pause();
    //bgm.currentTime = 0;
    objs = {};
    justStarted = true;
    initialize();
    //loop();
}

document.onkeydown = function(e) {
    if (!justStarted) {
        if (!paused && readyToGo) {
            key = e.keyCode;
            if (37 <= key && 40 >= key || key == 32) {
                e.preventDefault();
            }
        }
    }
}

document.onkeyup = function(e) {
    if (!paused && readyToGo) {
        if (37 <= e.keyCode && 40 >= e.keyCode || e.keyCode == 32) {
            if (justStarted) {
                justStarted = false;
                onStart();
            } else {
                if (key == e.keyCode) {
                    key = 0;
                }
            }
            e.preventDefault();
        }
    }
}

var touchX;
var touchY;

var newTouchX;
var newTouchY;

document.ontouchstart = function(e) {
    if (!paused) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
        newTouchX = e.touches[0].clientX;
        newTouchY = e.touches[0].clientY;
    }
}

document.ontouchmove = function(e) {
    if (!paused) {
        newTouchX = e.touches[0].clientX;
        newTouchY = e.touches[0].clientY;
    }
}

document.ontouchend = function(e) {
    if (!paused) {
        if (justStarted || gameover) {
            document.onkeyup({keyCode: 32});
        } else {
            dx = newTouchX - touchX;
            dy = newTouchY - touchY;
            //lurd 37 38 39 40
            if (Math.abs(dx) > Math.abs(dy)) {
                // horizontal
                if (dx > epsilon) {
                    //key = 39;
                    inputQueue.push(directions.right);
                } else if (dx < -epsilon) {
                    //key = 37;
                    inputQueue.push(directions.left);
                } else {
                    key = 0;
                }
            } else if (Math.abs(dy) > Math.abs(dx)) {
                // vertical
                if (dy > epsilon) {
                    //key = 40;
                    inputQueue.push(directions.down);
                } else if (dy < -epsilon) {
                    //key = 38;
                    inputQueue.push(directions.up);
                } else {
                    key = 0;
                }
            } else {
                key = 0;
            }
        }
    }
}

document.getElementById("canvas").onmouseup = function(e) {
    if (!clickedOnAButton) {
        document.onkeydown(e);
    } else {
        clickedOnAButton = false;
    }
}

function keydo() {
    //lurd 37 38 39 40
    var dirToPush;
    if (key == 37) {
        dirToPush = directions.left;
    } else if (key == 38) {
        dirToPush = directions.up;
    } else if (key == 39) {
        dirToPush = directions.right;
    } else if (key == 40) {
        dirToPush = directions.down;
    }
    if (dirToPush != null) {
        inputQueue.push(dirToPush);
    }
}

function loop(timestamp) {
    if (timestamp == undefined) {
        timestamp = 0;
        lastFrameTime = timestamp;
    }
    timedelta += timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    keydo();

    while (timedelta >= framestep) {
        if (!paused) {
            if (!justStarted) {
                update(framestep);
            }
        }
        timedelta -= framestep;
    }
    draw();

    if (keepGoing) {
        // this allows us to stop the recursive calling of the function, if we want to do that for some reason?
        requestAnimFrame(loop);
    }
}

function objsAtPos(x, y) {
    var x = goodmod(x, mapWidth);
    var y = goodmod(y, mapHeight);
    var result = [];
    for (var group in objs) {
        for (var o in objs[group]) {
            if (objs[group][o].imgid == '') continue;
            if (objs[group][o].x == x && objs[group][o].y == y) {
                result.push(objs[group][o]);
            }
        }
    }
    return result;
}

var unpauseOnFocus = false;

window.onfocus = function(e) {
    if (unpauseOnFocus) {
        unpauseOnFocus = false;
        paused = false;
    }
}

window.onblur = function(e) {
    if (!paused) {
        unpauseOnFocus = true;
    }
    paused = true;
}

document.getElementById("pause").onclick = function(e) {
    paused = !paused;
    if (paused) {
        document.getElementById("pause").innerHTML = "paused";
    } else {
        document.getElementById("pause").innerHTML = "pause";
    }
    unpausedByClick = false;
    clickedOnAButton = true;
}

document.getElementById("mute").onclick = function(e) {
    muted = !muted;
    if (muted) {
        //bgm.pause();
        document.getElementById("mute").innerHTML = "muted";
    } else {
        if (!justStarted && !dead) {
            //bgm.play();
        }
        document.getElementById("mute").innerHTML = "mute";
    }
    clickedOnAButton = true;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function onStart() {
    deleteObject('title');
    changeTextColor('score', 'white');
    //if (!muted) //bgm.play();
}

function moveCoords(x, y, dir) {
    switch(dir) {
        case directions.up:     return [x, y-1];
        case directions.down:   return [x, y+1];
        case directions.left:   return [x-1, y];
        case directions.right:  return [x+1, y];
    }
    return [x, y];
}

var timespeed = 1;

var movespeed = 5;

function canMove(obj) {
    // We can move boxes that haven't been 'solidified'.
    if (obj.imgid == 'box' && !obj.rooted) return true;
    return false;
}

function freeUpSpace(x, y, dir) {
    var os = objsAtPos(x,y);
    if (os.length == 0) {
        return true; // yes, we can move here
    } else {
        for (var i in os) {
            if (canMove(os[i])) {
                // If we can move it in theory, try moving it in practice.
                if (!nudge(os[i], dir)) {
                    return false;
                }
            } else {
                // It's a lost cause.
                return false;
            }
        }
    }
    return true;
}

function nudge(obj, dir) {
    var nextPos = moveCoords(obj.x, obj.y, dir);
    if (freeUpSpace(nextPos[0], nextPos[1], dir)) {
        obj.movedir = dir;
        return true;
    } else {
        return false;
    }
}

function update(delta) {
    if (inputQueue.length > 0) {
        var dir = inputQueue.shift();
        if (me.movedir == 0) {
            nudge(me, dir);
        }
    }

    for (var group in objs) {
        for (var o in objs[group]) {
            var obj = objs[group][o];
            if (obj.movedir == undefined) continue;
            if (obj.dist < 1 && obj.movedir != 0) {
                var moveAmt = movespeed * delta / 1000;
                obj.dist += moveAmt;
                switch(obj.movedir) {
                    case directions.up:
                        obj.y -= moveAmt;
                        break;
                    case directions.down:
                        obj.y += moveAmt;
                        break;
                    case directions.left:
                        obj.x -= moveAmt;
                        break;
                    case directions.right:
                        obj.x += moveAmt;
                        break;
                    default: console.log("help what" + obj.movedir);
                }
            }

            if (obj.dist >= 1) {
                obj.dist = 0;
                obj.movedir = 0;
                obj.x = goodmod(Math.round(obj.x), mapWidth);
                obj.y = goodmod(Math.round(obj.y), mapHeight);
            }
        }
    }

}

function drawObj(obj, group, ctx) {
    //console.log(obj.bgcolor, objs[group].bgcolor);
    ctx.save();
    if (obj.bgcolor != undefined) {
        ctx.fillStyle = 'rgb('+colors[obj.bgcolor]+')';
    } else if (objs[group].bgcolor != undefined) {
        ctx.fillStyle = 'rgb('+colors[objs[group].bgcolor]+')';
    } else {
        ctx.fillStyle = bgcolor;
    }
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.rect(0, 0, tileSize, tileSize);
    ctx.fill();
    ctx.translate(1, 1);

    ctx.shadowColor = 'rgb(' + colors[obj.color] + ')';
    ctx.shadowBlur = 3;
    var img = images[obj.imgid+'//'+obj.color];
    if (img != undefined) {
        if (obj.dir != 0) {
            // rotate object properly
            ctx.rotate(directionAngles[obj.dir-1][0]);
            ctx.translate(directionAngles[obj.dir-1][1] * img.width, directionAngles[obj.dir-1][2] * img.height);
        }
        ctx.drawImage(img, 0, 0);
    }
    ctx.restore();
}

function draw() {
    ctx.fillStyle = bgcolor;
    ctx.beginPath();
    ctx.rect(0, 0, mapWidth * tileSize * mapScale + 2, mapHeight * tileSize * mapScale);
    ctx.fill();
    ctx.save();
    ctx.scale(mapScale, mapScale);

    Object.keys(objs).sort(function(a, b) { return (objs[a].z || 0) >= (objs[b].z || 0) }).map(function(group) {
        for (var o in objs[group]) {
            if (o != 'bgcolor' && o != 'z') {
                var obj = objs[group][o];

                ctx.save();
                if (objs[group].slidy != undefined) {
                    ctx.translate(goodmod(obj.x, mapWidth) * tileSize, goodmod(obj.y, mapHeight) * tileSize);
                } else {
                    ctx.translate(Math.floor(obj.x) * tileSize, Math.floor(obj.y) * tileSize);
                }
                drawObj(obj, group, ctx);
                ctx.restore();

                if (objs[group].slidy && goodmod(obj.x, mapWidth) > mapWidth - 1) {
                    ctx.save();
                    ctx.translate((goodmod(obj.x, mapWidth) - mapWidth) * tileSize, goodmod(obj.y, mapHeight) * tileSize);
                    drawObj(obj, group, ctx);
                    ctx.restore();
                }

                if (objs[group].slidy && goodmod(obj.y, mapHeight) > mapHeight - 1) {
                    ctx.save();
                    ctx.translate(goodmod(obj.x, mapWidth) * tileSize, (goodmod(obj.y, mapHeight) - mapHeight) * tileSize);
                    drawObj(obj, group, ctx);
                    ctx.restore();
                }
            }
        }
    });
    ctx.restore();
}

// modified from http://www.playmycode.com/blog/2011/06/realtime-image-tinting-on-html5-canvas/
function generateColorImage(img, rgb, callback) {
    var w = img.width;
    var h = img.height;
    var rgbks = [];

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage( img, 0, 0 );

    var pixels = ctx.getImageData( 0, 0, w, h ).data;

    var loadedParts = 0;

    // 4 is used to ask for 3 images: red, green, blue and
    // black in that order.
    for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
        var canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;

        var ctx = canvas.getContext('2d');
        ctx.drawImage( img, 0, 0 );
        var to = ctx.getImageData( 0, 0, w, h );
        var toData = to.data;

        for (
                var i = 0, len = pixels.length;
                i < len;
                i += 4
            ) {
                toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                toData[i+3] =                pixels[i+3]    ;
            }

        ctx.putImageData( to, 0, 0 );

        // image is _slightly_ faster then canvas for this, so convert
        var imgComp = new Image();
        imgComp.src = canvas.toDataURL();

        rgbks.push( imgComp );

        imgComp.onload = function() {
            loadedParts++;
            if (loadedParts == 4) {
                var i = generateTintImage(img, rgbks, rgb[0], rgb[1], rgb[2]);
                callback(i);
            }
        }
    }
}

function generateTintImage(img, rgbks, red, green, blue) {
    var buff = document.createElement( "canvas" );
    buff.width  = img.width;
    buff.height = img.height;

    var ctx  = buff.getContext("2d");

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage( rgbks[3], 0, 0 );

    ctx.globalCompositeOperation = 'lighter';
    if ( red > 0 ) {
        ctx.globalAlpha = red   / 255.0;
        ctx.drawImage( rgbks[0], 0, 0 );
    }
    if ( green > 0 ) {
        ctx.globalAlpha = green / 255.0;
        ctx.drawImage( rgbks[1], 0, 0 );
    }
    if ( blue > 0 ) {
        ctx.globalAlpha = blue  / 255.0;
        ctx.drawImage( rgbks[2], 0, 0 );
    }

    return buff;
}
