import Player from "./player.js";
import Laser from "./laser.js";
import { defineListeners, inputStates } from "./ecouteurs.js";
import Enemis from "./enemis.js";
import Explosion from "./explosion.js";
import Boss from "./boss.js";
import Bonus from "./bonus.js";

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
let bonuses = [];
let bonusCharge = 0;
const MAX_BONUS_CHARGE = 3;
let isFiringBeam = false;
let stars = [];



function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 3 + 1
        });
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function drawStars(ctx) {
    ctx.fillStyle = "white";
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}


/* Fonctions qui permettent de mettre a jour le score et le niveau dans le localStorage et l'affichage utilisateur */
function updateScore() {
    document.getElementById("score").innerText = score;
    localStorage.setItem('score', score);
}

function updateLevel() {
    localStorage.setItem('level', lvl);
}

function updateBonusUI() {
    let percentage = (bonusCharge / MAX_BONUS_CHARGE) * 100;
    if (percentage > 100) percentage = 100;
    document.getElementById("bonus-bar-fill").style.width = percentage + "%";

    if (bonusCharge >= MAX_BONUS_CHARGE) {
        document.getElementById("bonus-bar-fill").style.boxShadow = "0 0 20px red";
        document.getElementById("bonus-bar-fill").style.background = "linear-gradient(90deg, #ff0000, #ff5500)";
    } else {
        document.getElementById("bonus-bar-fill").style.boxShadow = "0 0 10px #ffcc00";
        document.getElementById("bonus-bar-fill").style.background = "linear-gradient(90deg, #ffcc00, #ffaa00)";
    }
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

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
    gameState = 'MENU';
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
    bossLasers = [];
    boss = null;
    spawningFinished = false;
    bonuses = [];
    bonusCharge = 0;
    updateBonusUI();
    stars = [];
    initStars();

    //On cache les éléments du menu, les scores et les autres écrans quand on lance le jeu (logique)
    document.querySelector('.glass-container').style.display = 'none';

    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('defeatScreen').style.display = 'none';

    document.getElementById('gameInfos').style.display = 'flex';
    document.getElementById('level').innerText = level;

    canvas.style.display = 'block';

    //On crée le joueur
    player = new Player(canvas.width / 2, canvas.height - 100, "red", 130, 130);

    /* Ici, suivant le niveau, on adapte les enemis (temps de spawn, différents enemis et boss pour le dernier niveau) On notera que le boss n'est pas un enemis comme les autres, il possède sa propre classe car il a plein de particularités */
    if (level === 1) {
        let maxTime = 25000;
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 500 * i);
        }
        setTimeout(() => { if (gameState === 'GAME') spawningFinished = true; }, maxTime + 800);
    }

    if (level === 2) {
        let maxTime = 24000;
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 80, 80, "small"));
            }, 300 * i);
        }
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                if (gameState !== 'GAME') return;
                let x = Math.random() * canvas.width;
                let y = -50;
                enemis.push(new Enemis(x, y, "green", 100, 100, "medium"));
            }, 600 * i);
        }
        setTimeout(() => { if (gameState === 'GAME') spawningFinished = true; }, maxTime + 1000);
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
    updateStars();
    // deplacement du joueur
    if (player) {
        if (inputStates.left) {
            player.x -= 6;
        }
        if (inputStates.right) {
            player.x += 6;
        }
        if (inputStates.up) {
            player.y -= 6;
        }
        if (inputStates.down) {
            player.y += 6;
        }

        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.largeur) player.x = canvas.width - player.largeur;
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.hauteur) player.y = canvas.height - player.hauteur;
        if (bonusCharge >= MAX_BONUS_CHARGE) {
            player.bonusActive = true;
        }

        if (player.bonusActive) {
            // Decay du bonus (dure environ 5 secondes)
            bonusCharge -= 0.01;
            updateBonusUI();
            if (bonusCharge <= 0) {
                bonusCharge = 0;
                player.bonusActive = false;
                updateBonusUI();
            }
        }

        isFiringBeam = false;
        if (inputStates.space) {
            if (player.bonusActive) {
                isFiringBeam = true;
            } else {
                // gestion du tir normal (latence implémentée pour éviter de tirer non stop)
                let currentTime = Date.now();
                if (currentTime - lastShotTime > 500) {
                    lasers.push(new Laser(player.x, player.y - player.hauteur / 2));
                    lastShotTime = currentTime;
                }
            }
        }

        // Gestion des bonus
        // Spawn aléatoire de bonus (faible probabilité pour charge, très faible pour shield)
        if (Math.random() < 0.003) {
            let x = Math.random() * (canvas.width - 30);
            let type = Math.random() < 0.2 ? "shield" : "charge"; // 20% chance d'avoir un bouclier
            bonuses.push(new Bonus(x, -30, "yellow", 30, 30, type));
        }

        if (player.shieldActive && Date.now() > player.shieldEndTime) {
            player.shieldActive = false;
        }

        for (let i = bonuses.length - 1; i >= 0; i--) {
            bonuses[i].move();
            if (bonuses[i].y > canvas.height) {
                bonuses.splice(i, 1);
                continue;
            }
            if (player.collide(bonuses[i])) {

                if (bonuses[i].type === "shield") {
                    player.shieldActive = true;
                    player.shieldEndTime = Date.now() + 3000;
                } else {
                    // C'est un bonus de charge
                    score += 500;
                    if (bonusCharge >= MAX_BONUS_CHARGE) {
                        bonusCharge--; // On en enlève un si on est pleins
                    } else {
                        bonusCharge++;
                    }
                    updateScore();
                    updateBonusUI();
                }
                bonuses.splice(i, 1);
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

            // Collision avec le Laser Continu (Beam)
            if (isFiringBeam) {
                // Vérification collision rectangulaire simple
                if (Math.abs(player.x - enemy.x) < (50 + enemy.largeur) / 2 &&
                    enemy.y < player.y + enemy.hauteur / 2) {

                    // Destruction immédiate ou gros dégâts
                    explosions.push(new Explosion(enemy.x, enemy.y, "yellow")); // Explosion spéciale
                    score += (enemy.type === "small" ? 100 : 300);
                    enemis.splice(i, 1);
                    updateScore();
                    continue; // Ennemi détruit, on passe au suivant
                }
            }

            if (player.collide(enemy)) {
                if (player.shieldActive || isFiringBeam) {
                    // Bouclier ou Rayon actif : on détruit l'ennemi sans prendre de dégats et on gagne du score
                    explosions.push(new Explosion(enemy.x, enemy.y, "cyan")); // Explosion bleue
                    if (enemy.type === "small") {
                        score += 100;
                    }
                    if (enemy.type === "medium") {
                        score += 300;
                    }
                    enemis.splice(i, 1);
                    updateScore();
                    continue;
                }

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
                if (!isFiringBeam) {
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
            }

            for (let j = lasers.length - 1; j >= 0; j--) {
                if (lasers[j].collide(boss)) {
                    explosions.push(new Explosion(boss.x, boss.y, "orange"));
                    lasers.splice(j, 1);
                    boss.life--;
                    if (boss.life <= 0) {
                        score += 7000;
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


        // Collision
        if (boss && boss.life > 0 && isFiringBeam) {
            if (Math.abs(player.x - boss.x) < (50 + boss.largeur) / 2 &&
                boss.y < player.y + boss.hauteur / 2) {
                // Dégats par frame (très rapide)
                boss.life -= 0.5;
                // Petite explosion
                if (Math.random() < 0.2) explosions.push(new Explosion(boss.x + (Math.random() * 100 - 50), boss.y + (Math.random() * 100 - 50), "yellow"));

                if (boss.life <= 0) {
                    score += 7000;
                    updateScore();
                    explosions.push(new Explosion(boss.x, boss.y, "red"));

                    setTimeout(() => {
                        boss = null;
                        gameState = 'WIN';
                        win();
                    }, 1000);
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
                if (player.shieldActive || isFiringBeam) {
                    // Invulnérable aux lasers du boss
                    bossLasers.splice(i, 1);
                    continue;
                }
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

    // On dessine le fond étoilé quel que soit l'état du jeu (Menu, Jeu, GameOver...)
    // Cela permet de respecter l'exigence "dessiné 60 fois par seconde dans la boucle"
    // Même si l'UI (boutons) est en HTML par dessus. (je ne sais pas si c'est correct, désolé)
    if (stars.length === 0) initStars();
    updateStars();
    drawStars(ctx);

    if (gameState === 'GAME') {
        updateGame();
        drawGame();
    } else if (gameState === 'MENU') {
    } else if (gameState === 'GAMEOVER') {
    } else if (gameState === 'WIN') {
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
        if (isFiringBeam) {
            ctx.save();
            ctx.translate(player.x, player.y);

            // 1. La Bulle d'Energie
            let radius = Math.max(player.largeur, player.hauteur) / 1.5 + 10;

            // Effet pulsation
            let pulse = Math.sin(Date.now() / 100) * 5;
            radius += pulse;

            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(69, 2, 253, 0.3)";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "gold";
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 215, 0, 0.8)";
            ctx.lineWidth = 3;
            ctx.stroke();

            // 2. Le Rayon (Partie Haute) - Part du haut de la bulle vers le haut de l'écran
            ctx.shadowBlur = 20;
            ctx.shadowColor = "gold";
            ctx.fillStyle = "rgba(69, 2, 253, 0.8)";

            // De -radius (haut de bulle) vers -player.y (haut écran)
            ctx.fillRect(-25, -player.y, 50, player.y - radius);

            // Coeur blanc haut
            ctx.fillStyle = "white";
            ctx.shadowBlur = 10;
            ctx.fillRect(-10, -player.y, 20, player.y - radius);

            // 3. Le Rayon (Partie Basse) - Part du bas de la bulle vers le bas de l'écran
            ctx.shadowBlur = 20;
            ctx.shadowColor = "gold";
            ctx.fillStyle = "rgba(69, 2, 253, 0.8)";

            // De radius (bas de bulle) vers canvas.height - player.y (bas écran)
            ctx.fillRect(-25, radius, 50, (canvas.height - player.y) - radius);

            // Coeur blanc bas
            ctx.fillStyle = "white";
            ctx.shadowBlur = 10;
            ctx.fillRect(-10, radius, 20, (canvas.height - player.y) - radius);

            ctx.restore();
        }

        if (player.life > 0) player.draw(ctx);

        bonuses.forEach(bonus => bonus.draw(ctx));
        lasers.forEach(laser => laser.draw(ctx));
        enemis.forEach(enemy => enemy.draw(ctx));

        if (boss && boss.life > 0) { boss.draw(ctx); boss.lifeBar(ctx); }
        bossLasers.forEach(laser => laser.draw(ctx));

        explosions.forEach(explosion => explosion.draw(ctx));
    }
}