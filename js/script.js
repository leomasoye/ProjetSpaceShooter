import Player from "./player.js";
import Laser from "./laser.js";
import { defineListeners, inputStates } from "./ecouteurs.js";

let canvas, ctx;
let player;
let requestId;
let gameState = 'MENU';
let lasers = [];
let lastShotTime = 0;

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
    buttons[3].onclick = () => showScores();

    mainLoop();
}

function startGame(level) {
    console.log("Starting Level " + level);
    gameState = 'GAME';
    lasers = [];

    document.querySelector('h1').style.display = 'none';
    document.querySelector('h3').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('img').style.display = 'none';

    document.getElementById('gameInfos').style.display = 'block';
    document.getElementById('level').innerText = level;

    canvas.style.display = 'block';

    player = new Player(canvas.width / 2, canvas.height - 100, "red", 130, 130);

}

function showScores() {
    // a faire
}

function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'GAME') {
        updateGame();
        drawGame();
    } else {
        // fond a mettrre 
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
            player.y += 5; 0
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
    }
}

function drawGame() {
    if (player) {
        player.draw(ctx);
        lasers.forEach(laser => laser.draw(ctx));
    }
}