/*
	Code by Gaetano Bonofiglio
	https://github.com/Kidel/
	MIT License
*/

var canvas = document.getElementById("snakeCanvas");
var ctx = canvas.getContext("2d");

var FOOD_COLOR = "#FF0000";
var TAIL_COLOR = "#FFFFFF";

function writeText(text) {
	ctx.font = "30px Arial";
	ctx.textAlign = "center"; 
	ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

var food = {
	position: { x: 0, y: 0 },
    height: 10,
    width: 10,
    color: FOOD_COLOR,
    draw: function (canvasContext) {
        canvasContext.beginPath();
        canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();
    },
	start: function (position, velocity) {
        this.newPosition();
	},
	update: function (canvas, canvasContext) {
		this.draw(canvasContext);
    },
    newPosition: function () {
        var newX = Math.floor(((Math.random() * canvas.width - this.width * 2) + this.width) / 10) * 10;
        var newY = Math.floor(((Math.random() * canvas.height - this.height * 2) + this.height) / 10)*10;
        // TODO check if not inside snake
        this.position = { x: newX, y: newY };
    }
};

function collisionDetection(head, food) {
    return (head.position.x == food.position.x) && (head.position.y == food.position.y);
}

var snake = {
    bricks: [],
    height: 10,
    width: 10,
	command: "right",
	control: function (canvas) {
        if (controls.rightPressed && !(this.command == "left")) {
            this.command = "right";
		}
        else if (controls.leftPressed && !(this.command == "right")) {
            this.command = "left";
		}
        else if (controls.upPressed && !(this.command == "down")) {
            this.command = "up";
		}
        else if (controls.downPressed && !(this.command == "up")) {
            this.command = "down";
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
    move: function () {
        // draw the tail in front of the head
        this.addBrick(this.bricks[0].position);
        this.bricks.pop();
        if (this.command == "right")
            this.bricks[0].position = { x: this.bricks[0].position.x + this.width, y: this.bricks[0].position.y };
        else if (this.command == "left")
            this.bricks[0].position = { x: this.bricks[0].position.x - this.width, y: this.bricks[0].position.y };
        else if (this.command == "down")
            this.bricks[0].position = { x: this.bricks[0].position.x, y: this.bricks[0].position.y + this.height };
        else if (this.command == "up")
            this.bricks[0].position = { x: this.bricks[0].position.x, y: this.bricks[0].position.y - this.height };
    },
    start: function (position) {
        for (var i = 0; i < 3; i++)
            this.addBrick({ x: position.x, y: position.y - (i * this.width) });
	},
	update: function (canvas, canvasContext) {
        this.control(canvas);
        this.move();
		for (var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].update(canvasContext);
        }
    },
    addBrick: function (position, tail) {
        var b = {
            height: 10,
            width: 10,
            position: position,
            color: TAIL_COLOR,
            canBeDestroyed: false,
            draw: function (canvasContext) {
                canvasContext.beginPath();
                canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
                canvasContext.fillStyle = this.color;
                canvasContext.fill();
                canvasContext.closePath();
            },
            start: function (position) {
                this.position = position;
            },
            update: function (canvasContext) {
                this.draw(canvasContext);
            }
        };
        if (tail) {
            this.bricks.push(b);
        }
        else
            this.bricks.unshift(b);
    }
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
	food.start({ x: canvas.width / 2, y: canvas.height - 30 }, { x: 1, y: -1 });
    snake.start({ x: Math.floor(((canvas.width - snake.width) / 2) / 10) * 10, y: Math.floor(canvas.height / 10) * 10 - snake.height - 10 });
	food.physics = snake.bricks;
}

function update() {
    clearCanvas(ctx);
    snake.update(canvas, ctx);
    if (collisionDetection(snake.bricks[0], food)) {
        food.newPosition();
        snake.addBrick(snake.bricks[snake.bricks.length - 1].position, true);
    }
	food.update(canvas, ctx);
}

start();
setInterval(update, 100);