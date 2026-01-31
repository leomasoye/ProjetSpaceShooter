import Player from "./player.js";
import Ennemi from "./ennemis.js";

window.onload = init;

let canvas, ctx;
let player, ennemis = [];
let etat, niveau, score, nbVies;


async function init() {

     ctx = canvas.getContext("2d");

    startGame();
}