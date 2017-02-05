/*
	Code by Gaetano Bonofiglio
	https://github.com/Kidel/
	MIT License
*/

var canvas = document.getElementById("snakeCanvas");
var ctx = canvas.getContext("2d");

var BALL_COLOR = "#FF0000";
var TAIL_COLOR = "#FFFFFF";

function writeText(text) {
	ctx.font = "30px Arial";
	ctx.textAlign = "center"; 
	ctx.fillText(text, canvas.width / 2, canvas.height / 2);
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
	collision: function (canvas) {
		var hitX = false;
		for (var i = 0; i < this.physics.length; i++) {
			hitX = hitX || this.collisionX(this.physics[i]);
			if (hitX) {
				break;
			}
		}
		if (this.isOutOfCanvasX(canvas) || hitX)
			this.velocity.x = -this.velocity.x;
		var hitY = false;
		for (var i = 0; i < this.physics.length; i++) {
			hitY = hitY || this.collisionY(this.physics[i]);
			if (hitY) {
				break;
			}
		}
		if (this.isOutOfCanvasY(canvas) || hitY)
			this.velocity.y = -this.velocity.y;
		if(hitX || hitY){
			var newX = Math.floor((Math.random() * canvas.width - this.radius * 2) + this.radius);
			var newY = Math.floor((Math.random() * canvas.height - this.radius * 2) + this.radius);
			// TODO check if not inside snake
			this.position = {x: newX, y: newY};
		}
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
		var newX = Math.floor((Math.random() * canvas.width - this.radius * 2) + this.radius);
		var newY = Math.floor((Math.random() * canvas.height - this.radius * 2) + this.radius);
		// TODO check if not inside snake
		this.position = {x: newX, y: newY};
	},
	update: function (canvas, canvasContext) {
		this.draw(canvasContext);
		this.collision(canvas);
		this.applyVelocity();
	}
};

var snake = {
	bricks: [],
	commands: [],
	control: function (canvas) {
		if (controls.rightPressed && !this.isOutOfCanvasLeft(canvas)) {
			this.commands.unshift({ x: 3, y: 0 });
			this.commands.pop();
		}
		else if (controls.leftPressed && !this.isOutOfCanvasRight(canvas)) {
			this.commands.unshift({ x: -3, y: 0 });
			this.commands.pop();
		}
		else if (controls.upPressed && !this.isOutOfCanvasTop(canvas)) {
			this.commands.unshift({ x: 0, y: -3 });
			this.commands.pop();
		}
		else if (controls.downPressed && !this.isOutOfCanvasBottom(canvas)) {
			this.commands.unshift({ x: 0, y: 3 });
			this.commands.pop();
		}
	},
	isOutOfCanvasLeft: function (canvas) {
		return this.bricks[0].position.x > canvas.width - this.bricks[0].width;
	},
	isOutOfCanvasRight: function (canvas) {
		return this.bricks[0].position.x < 0;
	},
	isOutOfCanvasTop: function (canvas) {
		return this.bricks[0].position.y < 0;
	},
	isOutOfCanvasBottom: function (canvas) {
		return this.bricks[0].position.y > canvas.height - this.bricks[0].height;
	},
	start: function (position, velocity) {
		for (var i = 0; i < this.bricks.length; i++) {
			this.commands.unshift(velocity);
			this.bricks[i].start({ x: position.x - i * this.bricks[i].height, y: position.y - i * this.bricks[i].width }, { x: 0, y: -3 });
		}
	},
	update: function (canvas, canvasContext) {
		this.control(canvas);
		for (var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].velocity = this.commands[i];
			this.bricks[i].update(canvasContext);
		}
	}
}

snake.bricks.push({
	height: 10,
	width: 10,
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	color: TAIL_COLOR,
	canBeDestroyed: false,
	move: function () {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	},
	draw: function (canvasContext) {
		canvasContext.beginPath();
		canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
		canvasContext.fillStyle = this.color;
		canvasContext.fill();
		canvasContext.closePath();
	},
	start: function (position, velocity) {
		this.position = position;
		this.velocity = velocity;
	},
	update: function (canvasContext) {
		this.move();
		this.draw(canvasContext);
	}
});


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
	if (e.keyCode == 39) {
		controls.rightPressed = true;
	}
	else if (e.keyCode == 37) {
		controls.leftPressed = true;
	}
	else if (e.keyCode == 38) {
		controls.upPressed = true;
	}
	else if (e.keyCode == 40) {
		controls.downPressed = true;
	}
}
function keyUpHandler(e) {
	if (e.keyCode == 39) {
		controls.rightPressed = false;
	}
	else if (e.keyCode == 37) {
		controls.leftPressed = false;
	}
	else if (e.keyCode == 38) {
		controls.upPressed = false;
	}
	else if (e.keyCode == 40) {
		controls.downPressed = false;
	}
}

function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function start() {
	ball.start({ x: canvas.width / 2, y: canvas.height - 30 }, { x: 1, y: -1 });
	snake.start({ x: (canvas.width - snake.bricks[0].width) / 2, y: canvas.height - snake.bricks[0].height - 10 }, { x: 0, y: -3 });
	ball.physics = snake.bricks;
}

function update() {
	clearCanvas(ctx);
	snake.update(canvas, ctx);
	ball.update(canvas, ctx);
}

start();
setInterval(update, 5);