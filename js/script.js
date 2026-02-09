import Player from "./player.js";
import Laser from "./laser.js";
import { defineListeners, inputStates } from "./ecouteurs.js";
import Enemis from "./enemis.js";
import Explosion from "./explosion.js";
import Boss from "./boss.js";

let canvas, ctx;
let player;
let requestId;
let gameState = 'MENU';
let lasers = [];
let enemis = [];
let explosions = [];
let bossLasers = [];
let boss = null;
let lastShotTime = 0;
let score = 0;
let lvl = 0;


/* Fonctions qui permettent de mettre a jour le score et le niveau dans le localStorage et l'affichage utilisateur */
function updateScore() {
    document.getElementById("score").innerText = score;
    localStorage.setItem('score', score);
}

function updateLevel() {
    document.getElementById("level").innerText = lvl;
    localStorage.setItem('level', lvl);
}

/* On charge le jeu */
window.onload = init;

function init() {
    //On défini ce qui est necessaire
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    //Ensuite la taille du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //On écoute les evenements défini dans ecouteurs.js
    defineListeners();

    //On récupere les boutons
    const buttons = document.querySelectorAll('.button-container button');

    //On définit ce qui se passe quand on clique sur le bouton retour
    document.getElementById('returnBtn').onclick = () => {
        gameState = 'MENU';
        location.reload();
    };

    //On récupere le nombre de niveaux verrouillés
    let levelsUnlocked = localStorage.getItem('levelsUnlocked') ? parseInt(localStorage.getItem('levelsUnlocked')) : 1;

    //On parcourt les boutons
    buttons.forEach((btn, index) => {
        //Si le niveau est verrouillé on le signal a l'user
        if (index + 1 > levelsUnlocked && index < 3) {
            btn.style.opacity = '0.5';
            btn.onclick = () => alert("Niveau verrouillé ! Terminez le niveau précédent d'abord.");
        } else if (index < 3) {
            btn.onclick = () => startGame(index + 1);
        }
    });

    //On lance la boucle principale de jeu
    mainLoop();
}

/* Fonction qui permet de lancer le jeu */
let spawningFinished = false;

function startGame(level) {
    //On définit tous les trucs necessaires pour la suite (niveau, on initialise les laser avec des listes, etc)
    lvl = level;
    updateLevel();
    gameState = 'GAME';
    lasers = [];
    explosions = [];
    bossLasers = [];
    boss = null;
    spawningFinished = false;

    //On cache les éléments du menu, les scores et les autres écrans quand on lance le jeu (logique)
    document.querySelector('h1').style.display = 'none';
    document.querySelector('h3').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('img').style.display = 'none';

    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('defeatScreen').style.display = 'none';

    document.getElementById('gameInfos').style.display = 'flex';
    document.getElementById('level').innerText = level;

    canvas.style.display = 'block';

    //On crée le joueur
    player = new Player(canvas.width / 2, canvas.height - 100, "red", 130, 130);

    /* Ici, suivant le niveau, on adapte les enemis (temps de spawn, différents enemis et boss pour le dernier niveau) On notera que le boss n'est pas un enemis comme les autres, il possède sa propre classe car il a plein de particularités */
    if (level === 1) {
        let maxTime = 15000;
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 800 * i);
        }
        setTimeout(() => { if (gameState === 'GAME') spawningFinished = true; }, maxTime + 800);
    }

    if (level === 2) {
        let maxTime = 21000;
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 400 * i);
        }
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 100, 100, "medium"));
            }, 700 * i);
        }
        setTimeout(() => { if (gameState === 'GAME') spawningFinished = true; }, maxTime + 2000);
    }

    if (level === 3) {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 300 * i);
        }
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 100, 100, "medium"));
            }, 700 * i);
        }
        setTimeout(() => {
            if (gameState === 'GAME') {
                let x = canvas.width / 2;
                let y = -200;
                boss = new Boss(x, y, "green", 500, 500);
            }
        }, 2500); // Pas de fin de game ici puisque elle est définie en fonction du boss et pas des spawns
    }

}



/* Fonction qui permet de mettre à jour le jeu, elle gère par ex les déplacements du joueur et les lasers, les collisions, etc */
function updateGame() {
    // deplacement du joueur
    if (player) {
        if (inputStates.left) {
            player.x -= 9;
        }
        if (inputStates.right) {
            player.x += 9;
        }
        if (inputStates.up) {
            player.y -= 9;
        }
        if (inputStates.down) {
            player.y += 9;
        }

        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.largeur) player.x = canvas.width - player.largeur;
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.hauteur) player.y = canvas.height - player.hauteur;
        if (inputStates.space) {
            // gestion du tir (latence implémentée pour éviter de tirer non stop)
            let currentTime = Date.now();
            if (currentTime - lastShotTime > 500) {
                lasers.push(new Laser(player.x, player.y - player.hauteur / 2));
                lastShotTime = currentTime;
            }
        }

        // deplacement des lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].move();
            if (lasers[i].y < 0) {
                lasers.splice(i, 1);
            }
        }

        // gestion de toutes les collisions
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


        //Gestion du boss, de sa mort, ses lasers etc
        if (boss && boss.life > 0) {
            boss.move(canvas.width);
            let newLasers = boss.shoot();
            if (newLasers && newLasers.length > 0) {
                bossLasers.push(...newLasers);
            }

            if (player.collide(boss)) {
                player.life = 0;

                updateScore();
                explosions.push(new Explosion(player.x, player.y, "red"));
                if (player.life <= 0) {
                    setTimeout(() => {
                        gameState = 'GAMEOVER';
                        gameOver();
                    }, 1000);
                }
                player.updateLife();
            }

            for (let j = lasers.length - 1; j >= 0; j--) {
                if (lasers[j].collide(boss)) {
                    explosions.push(new Explosion(boss.x, boss.y, "orange"));
                    lasers.splice(j, 1);
                    boss.life--;
                    if (boss.life <= 0) {
                        score += 2000;
                        updateScore();
                        explosions.push(new Explosion(boss.x, boss.y, "red"));

                        setTimeout(() => {
                            boss = null;
                            gameState = 'WIN';
                            win();
                        }, 1000);
                    }
                    break;
                }
            }
        }

        for (let i = bossLasers.length - 1; i >= 0; i--) {
            let laser = bossLasers[i];
            laser.move();
            if (laser.y > canvas.height) {
                bossLasers.splice(i, 1);
                continue;
            }
            if (player.collide(laser)) {
                player.life--;
                player.updateLife();
                bossLasers.splice(i, 1);
                explosions.push(new Explosion(player.x, player.y, "red"));
                if (player.life <= 0) {
                    setTimeout(() => {
                        gameState = 'GAMEOVER';
                        gameOver();
                    }, 1000);
                }
            }
        }

        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update();
            if (explosions[i].life <= 0) {
                explosions.splice(i, 1);
            }
        }

        if ((lvl === 1 || lvl === 2) && spawningFinished && enemis.length === 0) {
            gameState = 'WIN';
            win();
        }

    }
}

// Fonction principale qui permet de mettre à jour et de dessiner le jeu grace a canva
function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'GAME') {
        updateGame();
        drawGame();
    }

    requestId = requestAnimationFrame(mainLoop);
}


/* Fonctions de victoires et de défaites, elles permettent de mettre à jour l'interface utilisateur et de stocker le score. On stocke les scores seulement quand c'est gagné, evidemment */
function gameOver() {
    if (gameState === 'GAMEOVER') {
        document.getElementById('defeatScreen').style.display = 'flex';
        document.getElementById('finalScoreDefeat').innerText = score;
    }
}

function win() {
    if (gameState === 'WIN') {
        document.getElementById('victoryScreen').style.display = 'flex';
        document.getElementById('finalScore').innerText = score;

        let key = 'scoreLevel' + lvl;
        let currentBest = localStorage.getItem(key) ? parseInt(localStorage.getItem(key)) : 0;
        if (score > currentBest) {
            localStorage.setItem(key, score);
        }

        let currentUnlocked = localStorage.getItem('levelsUnlocked') ? parseInt(localStorage.getItem('levelsUnlocked')) : 1;
        if (lvl >= currentUnlocked) {
            localStorage.setItem('levelsUnlocked', lvl + 1);
        }

        const nextBtn = document.getElementById('nextLevelBtn');
        if (lvl < 3) {
            nextBtn.style.display = 'block';
            nextBtn.onclick = () => startGame(lvl + 1);
        } else {
            nextBtn.style.display = 'none';
        }
    }
}

/* Fonction de dessin du jeu, elle permet de dessiner le joueur, les lasers, les ennemis, le boss et les explosions */
function drawGame() {
    if (player) {
        if (player.life > 0) player.draw(ctx);
        lasers.forEach(laser => laser.draw(ctx));
        enemis.forEach(enemy => enemy.draw(ctx));

        if (boss && boss.life > 0) { boss.draw(ctx); boss.lifeBar(ctx); }
        bossLasers.forEach(laser => laser.draw(ctx));

        explosions.forEach(explosion => explosion.draw(ctx));
    }
}