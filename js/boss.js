import objet from "./objet.js";
import Laser from "./laser.js";
import { Assets } from "./assets.js";

export default class boss extends objet {

    constructor(x, y, couleur, largeur, hauteur) {
        super(x, y, couleur, largeur, hauteur);
        this.speed = 0.1;
        this.dx = 1;
        this.image = Assets.enemyBoss;
        this.life = 30;
        this.maxLife = 30;
        this.lastShot = 0;
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.fillStyle = this.couleur;
        ctx.drawImage(this.image, -this.largeur / 2, -this.hauteur / 2, this.largeur, this.hauteur);


        ctx.restore();

    }

    move(canvasWidth) {
        if (this.y < 300) {
            this.y += this.speed;
        } else {
            this.x += this.dx;
            if (this.x > canvasWidth - this.largeur / 2 || this.x < 0 + this.largeur / 2) {
                this.dx = -this.dx;
            }
        }
    }

    lifeBar(ctx) {
        ctx.save();

        let screenWidth = ctx.canvas.width;
        let barWidth = screenWidth * 0.6;
        let barHeight = 20;
        let x = (screenWidth - barWidth) / 2;
        let y = 30;

        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(x, y, barWidth, barHeight);
        let ratio = this.life / this.maxLife;
        if (ratio < 0) ratio = 0;
        ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
        ctx.fillRect(x, y, barWidth * ratio, barHeight);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, barWidth, barHeight);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText("BOSS", x + 5, y + 16);

        ctx.restore();
    }

    shoot() {
        let now = Date.now();
        if (now - this.lastShot > 1500) {
            this.lastShot = now;
            return [
                new Laser(this.x, this.y + this.hauteur / 2, 5, 0, "red"),
                new Laser(this.x, this.y + this.hauteur / 2, 4, 2, "red"),
                new Laser(this.x, this.y + this.hauteur / 2, 4, -2, "red"),
                new Laser(this.x, this.y + this.hauteur / 2, 3, 4, "red"),
                new Laser(this.x, this.y + this.hauteur / 2, 3, -4, "red")
            ];
        }
        return [];
    }
}