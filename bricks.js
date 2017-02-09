/*
	Code by Gaetano Bonofiglio
	https://github.com/Kidel/
	MIT License
*/

var canvas = document.getElementById("bricksCanvas");
var ctx = canvas.getContext("2d");

var BALL_COLOR = "#FFFFFF";
var PADDLE_COLOR = "#8e8e8e";
var BRICK_COLORS = ["#c84848", "#c66c3a", "#a2a22a", "#48a048", "#4248c8"];

function writeText(text) {
    ctx.font = "30px Monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function writeSubText(text) {
    ctx.font = "20px Monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 30);
}

var ball = {
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	radius: 10,
	color: BALL_COLOR,
	colliderDifference: 5,
	physics: [],
	draw: function (canvasContext) {
		canvasContext.beginPath();
		canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		canvasContext.fillStyle = this.color;
		canvasContext.fill();
		canvasContext.closePath();
	},
	applyVelocity: function () {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	},
	bounce: function (canvas) {
		var hitX = false;
		for (var i = 0; i < this.physics.length; i++) {
			hitX = hitX || this.collisionX(this.physics[i]);
			if (hitX) {
				if (this.physics[i].canBeDestroyed) {
					this.physics[i].destroy();
					this.physics.splice(i, 1);
				}
				break;
			}
		}
		if (this.isOutOfCanvasX(canvas) || hitX)
			this.velocity.x = -this.velocity.x;
		var hitY = false;
		for (var i = 0; i < this.physics.length; i++) {
			hitY = hitY || this.collisionY(this.physics[i]);
			if (hitY) {
				if (this.physics[i].canBeDestroyed) {
					this.physics[i].destroy();
					this.physics.splice(i, 1);
				}
				break;
			}
		}
		if (this.isOutOfCanvasY(canvas) || hitY)
			this.velocity.y = -this.velocity.y;
	},
	isOutOfCanvasX: function (canvas) {
		return this.position.x + this.velocity.x > canvas.width - this.radius + this.colliderDifference || this.position.x + this.velocity.x < this.radius - this.colliderDifference;
	},
	isOutOfCanvasY: function (canvas) {
		return this.position.y + this.velocity.y < this.radius - this.colliderDifference || this.position.y + this.velocity.y > canvas.height - this.radius + this.colliderDifference;
	},
	collisionX: function (something) {
		return this.position.y + this.radius > something.position.y && this.position.y - this.radius < something.position.y + something.height &&
			((this.position.x - this.radius + this.colliderDifference == something.position.x + something.width && this.velocity.x < 0) ||
				(this.position.x + this.radius - this.colliderDifference == something.position.x && this.velocity.x >= 0));
	},
	collisionY: function (something) {
		return this.position.x + this.radius > something.position.x && this.position.x - this.radius < something.position.x + something.width &&
			((this.position.y - this.radius + this.colliderDifference == something.position.y + something.height && this.velocity.y < 0) ||
				(this.position.y + this.radius - this.colliderDifference == something.position.y && this.velocity.y >= 0));
	},
	start: function (position, velocity) {
		this.position = position;
		this.velocity = velocity;
	},
	update: function (canvas, canvasContext) {
		this.draw(canvasContext);
		this.bounce(canvas);
		this.applyVelocity();
	}
};

var paddle = {
	height: 10,
	width: 80,
	position: { x: 0, y: 0 },
	color: PADDLE_COLOR,
	canBeDestroyed: false,
	draw: function (canvasContext) {
		canvasContext.beginPath();
		canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
		canvasContext.fillStyle = this.color;
		canvasContext.fill();
		canvasContext.closePath();
	},
	control: function (canvas) {
		if (controls.rightPressed && !this.isOutOfCanvasLeft(canvas)) {
			this.position.x += 3;
		}
		else if (controls.leftPressed && !this.isOutOfCanvasRight(canvas)) {
			this.position.x -= 3;
		}
	},
	isOutOfCanvasLeft: function (canvas) {
		return this.position.x > canvas.width - this.width;
	},
	isOutOfCanvasRight: function (canvas) {
		return this.position.x < 0;
	},
	start: function (position) {
		this.position = position;
	},
	update: function (canvas, canvasContext) {
		this.control(canvas);
		this.draw(canvasContext);
	}
}

var bricks = [];

for (var i = 0; i < 40; i++) {
	bricks.push({
		height: 12,
		width: 50,
		position: { x: 0, y: 0 },
		color: BRICK_COLORS[0],
		status: true,
		canBeDestroyed: true,
		destroy: function () {
			this.status = false;
		},
		draw: function (canvasContext) {
			if (this.status) {
				canvasContext.beginPath();
				canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
				canvasContext.fillStyle = this.color;
				canvasContext.fill();
				canvasContext.closePath();
			}
		},
		start: function (position) {
			this.position = position;
		},
		update: function (canvasContext) {
			this.draw(canvasContext);
		}
	});
}

var controls = {
	rightPressed: false,
	leftPressed: false
}

console.log("listening to left and right");
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
	if (e.keyCode == 39 || e.keyCode == 68) {
		controls.rightPressed = true;
	}
	else if (e.keyCode == 37 || e.keyCode == 65) {
		controls.leftPressed = true;
	}
}
function keyUpHandler(e) {
	if (e.keyCode == 39 || e.keyCode == 68) {
		controls.rightPressed = false;
	}
	else if (e.keyCode == 37 || e.keyCode == 65) {
		controls.leftPressed = false;
	}
}

var game = {
	stop: false,
	alertShown: false,
	isGameOver: function (ball, canvas) {
		return ball.position.y + ball.velocity.y > canvas.height - ball.radius + ball.colliderDifference;
	},
	isGameWon: function (bricks) {
		var status = false;
		for (var i = 0; i < bricks.length; i++) {
			status = status || bricks[i].status;
			if (status) return false;
		}
		return !status;
	},
	gameOver: function () {
        if (!this.alertShown) {
            writeText("GAME OVER");
            writeSubText("click to reload")
        }
		this.alertShown = true;
	},
	gameWon: function () {
        if (!this.alertShown) {
            writeText("YOU WON");
            writeSubText("click to reload")
        }
		this.alertShown = true;
	},
	update: function (canvas, ball, bricks) {
		if (this.isGameOver(ball, canvas)) {
			this.gameOver();
			this.stop = true;
		}
		else if (this.isGameWon(bricks)) {
			this.gameWon();
			this.stop = true;
		}
	}
}

function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function start() {
    for (var i = 0; i < bricks.length; i++) {
        bricks[i].color = BRICK_COLORS[Math.floor(i / 8) % BRICK_COLORS.length];
        bricks[i].start({ x: 5 + (10 + bricks[i].width) * (i - 8 * Math.floor(i / 8)), y: bricks[i].height + 20 * (1 + Math.floor(i / 8)) });
		ball.physics.push(bricks[i]);
	}
	ball.start({ x: canvas.width / 2, y: canvas.height - 30 }, { x: 1, y: -1 });
	paddle.start({ x: (canvas.width - paddle.width) / 2, y: canvas.height - paddle.height - 10 });
	ball.physics.push(paddle);
}

function update() {
	if (!game.stop) {
		clearCanvas(ctx);
		game.update(canvas, ball, bricks);
		paddle.update(canvas, ctx);
		ball.update(canvas, ctx, paddle);
		for (var i = 0; i < bricks.length; i++) {
			bricks[i].update(ctx);
		}
	}
}

start();
setInterval(update, 5);

function reloadGame() {
    if (game.stop) location.reload(); 
}