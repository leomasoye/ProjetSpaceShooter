import Player from "./player.js";
import Laser from "./laser.js";
import { defineListeners, inputStates } from "./ecouteurs.js";
import Enemis from "./enemis.js";
import Explosion from "./explosion.js";

let canvas, ctx;
let player;
let requestId;
let gameState = 'MENU';
let lasers = [];
let enemis = [];
let explosions = [];
let lastShotTime = 0;
let score = 0;
let lvl = 0;

function updateScore() {
    document.getElementById("score").innerText = score;
}

function updateLevel() {
    document.getElementById("level").innerText = level;
}

window.onload = init;

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    defineListeners();

    const buttons = document.querySelectorAll('.button-container button');
    buttons[0].onclick = () => startGame(1);
    buttons[1].onclick = () => startGame(2);
    buttons[2].onclick = () => startGame(3);

    mainLoop();
}

function startGame(level) {
    lvl = level;
    updateLevel();
    gameState = 'GAME';
    lasers = [];
    explosions = [];

    document.querySelector('h1').style.display = 'none';
    document.querySelector('h3').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('img').style.display = 'none';

    document.getElementById('gameInfos').style.display = 'block';
    document.getElementById('level').innerText = level;

    canvas.style.display = 'block';

    player = new Player(canvas.width / 2, canvas.height - 100, "red", 130, 130);

    if (level === 1) {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 1000 * i);
        }
    }

    if (level === 2) {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 400 * i);
        }
        for (let i = 0; i < 7; i++) {
            setTimeout(() => {
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "medium"));
            }, 700 * i);
        }
    }

    if (level === 3) {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 300 * i);
        }
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "medium"));
            }, 700 * i);
        }
        setTimeout(() => {
            let x = Math.random() * canvas.width;
            let y = -50;
            enemis.push(new Enemis(x, y, "green", 80, 80, "large"));
        }, 10000);
    }

}



function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'GAME') {
        updateGame();
        drawGame();
    }

    requestId = requestAnimationFrame(mainLoop);
}

function updateGame() {
    if (player) {
        if (inputStates.left) {
            player.x -= 5;
        }
        if (inputStates.right) {
            player.x += 5;
        }
        if (inputStates.up) {
            player.y -= 5;
        }
        if (inputStates.down) {
            player.y += 5;
        }

        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.largeur) player.x = canvas.width - player.largeur;
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.hauteur) player.y = canvas.height - player.hauteur;
        if (inputStates.space) {
            let currentTime = Date.now();
            if (currentTime - lastShotTime > 500) {
                lasers.push(new Laser(player.x, player.y - player.hauteur / 2));
                lastShotTime = currentTime;
            }
        }

        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].move();
            if (lasers[i].y < 0) {
                lasers.splice(i, 1);
            }
        }

        for (let i = enemis.length - 1; i >= 0; i--) {
            let enemy = enemis[i];
            enemy.move();
            if (enemy.y > canvas.height + 100) {
                enemis.splice(i, 1);
                continue;
            }
            if (player.collide(enemy)) {
                if (enemy.type === "small") {
                    score -= 50;
                }
                if (enemy.type === "medium") {
                    score -= 200;
                }
                player.life--;
                enemis.splice(i, 1);
                updateScore();
                explosions.push(new Explosion(enemy.x, enemy.y, "orange"));
                if (player.life <= 0) {
                    explosions.push(new Explosion(player.x, player.y, "red"));
                    setTimeout(() => {
                        gameState = 'GAMEOVER';
                        gameOver();
                    }, 1000);
                }
                player.updateLife();
                continue;
            }

            for (let j = lasers.length - 1; j >= 0; j--) {
                if (lasers[j].collide(enemy)) {
                    explosions.push(new Explosion(enemy.x, enemy.y, "orange"));
                    enemis.splice(i, 1);
                    lasers.splice(j, 1);
                    if (enemy.type === "small") {
                        score += 100;
                    }
                    if (enemy.type === "medium") {
                        score += 300;
                    }
                    updateScore();
                    break;
                }
            }
        }

        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update();
            if (explosions[i].life <= 0) {
                explosions.splice(i, 1);
            }
        }

    }
}

function gameOver() {
    if (gameState === 'GAMEOVER') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function drawGame() {
    if (player) {
        if (player.life > 0) player.draw(ctx);
        lasers.forEach(laser => laser.draw(ctx));
        enemis.forEach(enemy => enemy.draw(ctx));
        explosions.forEach(explosion => explosion.draw(ctx));
    }
}