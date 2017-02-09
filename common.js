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