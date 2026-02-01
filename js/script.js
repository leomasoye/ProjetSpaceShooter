import Player from "./player.js";
import { defineListeners, inputStates } from "./ecouteurs.js";

let canvas, ctx;
let player;
let requestId;
let gameState = 'MENU';

window.onload = init;

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

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

    document.querySelector('h1').style.display = 'none';
    document.querySelector('h3').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('img').style.display = 'none';

    document.getElementById('gameInfos').style.display = 'block';
    document.getElementById('level').innerText = level;

    player = new Player(canvas.width / 2, canvas.height - 50, "red", 30, 30);

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
    }
}

function drawGame() {
    if (player) {
        player.draw(ctx);
    }
}