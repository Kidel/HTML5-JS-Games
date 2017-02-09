/*
	Code by Gaetano Bonofiglio
	https://github.com/Kidel/
	MIT License
*/

var canvas = document.getElementById("snakeCanvas");
var ctx = canvas.getContext("2d");

var FOOD_COLOR = "#23432b";
var BORDER_COLOR = "#23432b";
var TAIL_COLOR = "#54812c";
var STROKE_COLOR = "#d1e890";

var rect = {
    height: canvas.height - 20,
    width: canvas.width - 20,
    color: BORDER_COLOR,
    position: { x: 10, y: 10 },
    draw: function (canvas, canvasContext) {
        canvasContext.beginPath();
        canvasContext.rect(this.position.x - 1, 0, 1, canvas.height);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();

        canvasContext.beginPath();
        canvasContext.rect(canvas.width - this.position.x, 0, 1, canvas.height);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();

        canvasContext.beginPath();
        canvasContext.rect(0, this.position.y - 1, canvas.width, 1);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();

        canvasContext.beginPath();
        canvasContext.rect(0, canvas.height - this.position.y, canvas.width, 1);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();
    },
    update: function (canvas, canvasContext) {
        this.draw(canvas, canvasContext);
    }
};

var food = {
	position: { x: 0, y: 0 },
    height: 10,
    width: 10,
    color: FOOD_COLOR,
    draw: function (canvasContext) {
        canvasContext.beginPath();
        canvasContext.rect(this.position.x + 1, this.position.y + 1, this.width - 2, this.height - 2);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();
    },
    start: function (canvas, rect) {
        this.newPosition(canvas, rect);
	},
	update: function (canvas, canvasContext) {
		this.draw(canvasContext);
    },
    newPosition: function (canvas, rect) {
        var newX = Math.floor(((Math.random() * canvas.width - rect.position.x - this.width)) / 10) * 10 + rect.position.x;
        if (newX < rect.position.x) newX = rect.position.x;
        var newY = Math.floor(((Math.random() * canvas.height - rect.position.y - this.height)) / 10) * 10 + rect.position.y;
        if (newY < rect.position.y) newY = rect.position.y;
        this.position = { x: newX, y: newY };
    }
};

function foodCollisionDetection(head, food) {
    return (head.position.x == food.position.x) && (head.position.y == food.position.y);
}

var snake = {
    bricks: [],
    hit: false,
    height: 10,
    width: 10,
    command: "up",
    using: "up",
	control: function (canvas) {
        if (controls.rightPressed && !(this.using == "left")) {
            this.command = "right";
		}
        else if (controls.leftPressed && !(this.using == "right")) {
            this.command = "left";
		}
        else if (controls.upPressed && !(this.using == "down")) {
            this.command = "up";
		}
        else if (controls.downPressed && !(this.using == "up")) {
            this.command = "down";
        }
	},
	isOutOfCanvasLeft: function (canvas) {
        return this.bricks[0].position.x > canvas.width - this.bricks[0].width + canvas.position.x;
	},
	isOutOfCanvasRight: function (canvas) {
        return this.bricks[0].position.x < canvas.position.x;
	},
	isOutOfCanvasTop: function (canvas) {
        return this.bricks[0].position.y < canvas.position.y;
	},
	isOutOfCanvasBottom: function (canvas) {
        return this.bricks[0].position.y > canvas.height - this.bricks[0].height + canvas.position.y;
    },
    collision: function (canvas) {
        var selfHit = false;
        for (var i = 1; i < this.bricks.length; i++){
            selfHit = selfHit || (this.bricks[0].position.x == this.bricks[i].position.x && this.bricks[0].position.y == this.bricks[i].position.y);
            if (selfHit)
                break;
        }
        this.hit = selfHit || this.isOutOfCanvasLeft(canvas) || this.isOutOfCanvasRight(canvas) || this.isOutOfCanvasTop(canvas) || this.isOutOfCanvasBottom(canvas);
    },
    move: function () {
        // draw the tail in front of the head
        this.addBrick(this.bricks[0].position);
        this.bricks.pop();
        if (this.command == "right") {
            this.using = this.command;
            this.bricks[0].position = { x: this.bricks[0].position.x + this.width, y: this.bricks[0].position.y };
        }
        else if (this.command == "left") {
            this.using = this.command;
            this.bricks[0].position = { x: this.bricks[0].position.x - this.width, y: this.bricks[0].position.y };
        }
        else if (this.command == "down") {
            this.using = this.command;
            this.bricks[0].position = { x: this.bricks[0].position.x, y: this.bricks[0].position.y + this.height };
        }
        else if (this.command == "up") {
            this.using = this.command;
            this.bricks[0].position = { x: this.bricks[0].position.x, y: this.bricks[0].position.y - this.height };
        }
    },
    start: function (position) {
        for (var i = 0; i < 3; i++)
            this.addBrick({ x: position.x, y: position.y - (i * this.width) });
	},
	update: function (canvas, canvasContext, rect) {
        this.move();
		for (var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].update(canvasContext);
        }
        this.collision(rect);
    },
    realTimeUpdate: function (canvas) {
        this.control(canvas);
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
                canvasContext.rect(this.position.x + 1, this.position.y + 1, this.width - 2, this.height - 2);
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

var game = {
    stop: false,
    alertShown: false,
    isGameOver: function (sname) {
        return snake.hit;
    },
    isGameWon: function (bricks, rect) {
        return bricks.length >= rect.height * rect.width;
    },
    gameOver: function () {
        if (!this.alertShown) {
            writeText("GAME OVER");
            writeSubText("click to reload");
            playSound('gameover');
        }
        this.alertShown = true;
    },
    gameWon: function () {
        if (!this.alertShown) {
            writeText("YOU WON");
            writeSubText("click to reload");
            playSound('win');
        }
        this.alertShown = true;
    },
    update: function (snake, bricks, rect) {
        if (this.isGameOver(snake)) {
            this.gameOver();
            this.stop = true;
        }
        else if (this.isGameWon(bricks, rect)) {
            this.gameWon();
            this.stop = true;
        }
    }
}

function start() {
    food.start(canvas, rect);
    snake.start({ x: Math.floor(((canvas.width - snake.width) / 2) / 10) * 10, y: Math.floor(canvas.height / 10) * 10 - snake.height - 10 });
	food.physics = snake.bricks;
}

var points = 0;

function update() {
    if (!game.stop) {
        clearCanvas(canvas, ctx);
        rect.update(canvas, ctx);
        snake.update(canvas, ctx, rect);
        if (foodCollisionDetection(snake.bricks[0], food)) {
            playSound('bip');
            food.newPosition(canvas, rect);
            snake.addBrick(snake.bricks[snake.bricks.length - 1].position, true);
            ++points;
        }
        food.update(canvas, ctx);
        writePoints("POINTS: " + points);
        writeTime();
        game.update(snake, snake.bricks, rect);
    }
}

function realTimeUpdate() {
    snake.realTimeUpdate(canvas);
}

start();
setInterval(update, 80);
setInterval(realTimeUpdate, 5);

function reloadGame() {
    if (game.stop) location.reload();
}