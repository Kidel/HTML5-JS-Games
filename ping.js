/*
	Code by Gaetano Bonofiglio
	https://github.com/Kidel/
	MIT License
*/

var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");

var BALL_COLOR = "#FFFFFF";
var PADDLE_COLOR = "#FFFFFF";
var LINE_COLOR = "#666666";

var scored = "none";
var playerScore = 0;
var enemyScore = 0;

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
		var i = 0
		var hitX = false;
		for (i = 0; i < this.physics.length; i++) {
            hitX = this.collisionX(this.physics[i]);
            if (hitX !== false) break;
		}
        var oocX = this.isOutOfCanvasX(canvas);
        if (oocX == 1) scored = "player";
        if (oocX == -1) scored = "enemy";
        if (hitX !== false) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 3 * (hitX-0.5);
        }
		var hitY = false;
		var j = 0
		for (j = 0; j < this.physics.length; j++) {
			hitY = hitY || this.collisionY(this.physics[j]);
			if (hitY)
				break;
		}
		var oocY = this.isOutOfCanvasY(canvas);
		if (oocY || hitY)
			this.velocity.y = -this.velocity.y;
		if(hitX || hitY) j==0 || i==0 ? playSound('soft_hit') : playSound('hit');
		if(oocY) playSound('soft_hit');
	},
	isOutOfCanvasX: function (canvas) {
        if (this.position.x + this.velocity.x > canvas.width - this.radius + this.colliderDifference) return 1; // player scored
        if (this.position.x + this.velocity.x < this.radius - this.colliderDifference) return -1;
        return 0;
	},
	isOutOfCanvasY: function (canvas) {
		return this.position.y + this.velocity.y < this.radius - this.colliderDifference || this.position.y + this.velocity.y > canvas.height - this.radius + this.colliderDifference;
	},
	collisionX: function (something) {
		if (this.position.y + this.radius > something.position.y && this.position.y - this.radius < something.position.y + something.height &&
			((this.position.x - this.radius + this.colliderDifference == something.position.x + something.width && this.velocity.x < 0) ||
                (this.position.x + this.radius - this.colliderDifference == something.position.x && this.velocity.x >= 0)))
            return (this.position.y - something.position.y) / something.height;
        else return false;
	},
	collisionY: function (something) {
        return (this.position.x + this.radius > something.position.x && this.position.x - this.radius < something.position.x + something.width &&
            ((this.position.y - this.radius + this.colliderDifference == something.position.y + something.height && this.velocity.y < 0) ||
                (this.position.y + this.radius - this.colliderDifference == something.position.y && this.velocity.y >= 0)))
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
	height: 80,
	width: 10,
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
		if (controls.downPressed && !this.isOutOfCanvasBottom(canvas)) {
			this.position.y += 2;
		}
		else if (controls.upPressed && !this.isOutOfCanvasTop(canvas)) {
			this.position.y -= 2;
		}
	},
    isOutOfCanvasBottom: function (canvas) {
        return this.position.y > canvas.height - this.height;
	},
    isOutOfCanvasTop: function (canvas) {
		return this.position.y < 0;
	},
	start: function (position) {
		this.position = position;
	},
	update: function (canvas, canvasContext) {
		this.control(canvas);
		this.draw(canvasContext);
	}
}

var enemy = {
    height: 80,
    width: 10,
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
    isOutOfCanvasBottom: function (canvas) {
        return this.position.y > canvas.height - this.height;
    },
    isOutOfCanvasTop: function (canvas) {
        return this.position.y < 0;
    },
    control: function (ball, canvas) {
        if (ball.position.y > Math.floor(this.position.y + this.height * 2 / 3) && !this.isOutOfCanvasBottom(canvas)) {
            this.position.y += 1;
        }
        else if (ball.position.y < Math.floor(this.position.y + this.height / 3) && !this.isOutOfCanvasTop(canvas)) {
            this.position.y -= 1;
        }
    },
    start: function (position) {
        this.position = position;
    },
    update: function (ball, canvas, canvasContext) {
        this.control(ball, canvas);
        this.draw(canvasContext);
    }
};

function start() {
    ball.physics.push(paddle);
    ball.physics.push(enemy);
    ball.start({ x: canvas.width / 2, y: canvas.height / 2 }, { x: Math.random() > 0.5 ? 1:-1, y: 0 });
    paddle.start({ x: 10, y: (canvas.height - paddle.height) / 2 });
    enemy.start({ x: canvas.width - enemy.width - 10, y: (canvas.height - enemy.height) / 2 });
}

var game = {
    stop: false,
    alertShown: false,
    isGameOver: function (ball, canvas) {
        return enemyScore >= 5;
    },
    isGameWon: function () {
        return playerScore >= 5;
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
    update: function (canvas, ball) {
        if (this.isGameOver(ball, canvas)) {
            this.gameOver();
            this.stop = true;
        }
        else if (this.isGameWon()) {
            this.gameWon();
            this.stop = true;
        }
        if (scored == "player")
            playerScore++;
        if (scored == "enemy")
            enemyScore++;
        if (scored != "none") {
            playSound('bip');
            start();
            scored = "none";
        }
    }
}

function update() {
	if (!game.stop) {
        clearCanvas(canvas, ctx);

        // drawline
        ctx.beginPath();
        ctx.rect(canvas.width / 2, 0, 1, canvas.height);
        ctx.fillStyle = LINE_COLOR;
        ctx.fill();
        ctx.closePath();
        //

		game.update(canvas, ball);
        paddle.update(canvas, ctx);
        enemy.update(ball, canvas, ctx);
        ball.update(canvas, ctx, paddle);
        writeScore(playerScore + "      " + enemyScore);
    }     
}

start();
setInterval(update, 5);

function reloadGame() {
    if (game.stop) location.reload(); 
}