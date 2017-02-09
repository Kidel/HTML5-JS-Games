function playSound(sound){
    var audio = new Audio('sounds/' + sound + '.mp3');
    audio.play();
}

function writeText(text) {
    ctx.font = "30px Monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function writePoints(text) {
    ctx.font = "12px Monospace";
    ctx.textAlign = "left";
    ctx.fillText(text, 12, canvas.height);
}

function writeSubText(text) {
    ctx.font = "20px Monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 30);
}

function writeScore(text) {
    ctx.font = "20px Monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, 20);
}

var initialSeconds = Math.floor(Date.now() / 1000)

function writeTime() {
    var seconds = Math.floor(Date.now() / 1000) - initialSeconds;
    ctx.font = "12px Monospace";
    ctx.textAlign = "right";
    ctx.fillText(seconds, canvas.width - 12, canvas.height);
}

function clearCanvas(canvas, canvasContext) {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

var controls = {
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false
}

console.log("listening to arrows");
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        controls.rightPressed = true;
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        controls.leftPressed = true;
    }
    else if (e.keyCode == 38 || e.keyCode == 87) {
        controls.upPressed = true;
    }
    else if (e.keyCode == 40 || e.keyCode == 83) {
        controls.downPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        controls.rightPressed = false;
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        controls.leftPressed = false;
    }
    else if (e.keyCode == 38 || e.keyCode == 87) {
        controls.upPressed = false;
    }
    else if (e.keyCode == 40 || e.keyCode == 83) {
        controls.downPressed = false;
    }
}