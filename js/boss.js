import objet from "./objet.js";
import Laser from "./laser.js";

export default class boss extends objet {

    constructor(x, y, couleur, largeur, hauteur) {
        super(x, y, couleur, largeur, hauteur);
        this.speed = 0.1;
        this.dx = 1;
        this.image = new Image();
        this.image.src = "assets/images/boss.png";
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
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.largeur / 2, this.y - this.hauteur / 2 - 20, this.largeur, 10);

        ctx.fillStyle = "green";
        let ratio = this.life / this.maxLife;
        if (ratio < 0) ratio = 0;
        ctx.fillRect(this.x - this.largeur / 2, this.y - this.hauteur / 2 - 20, this.largeur * ratio, 10);

        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x - this.largeur / 2, this.y - this.hauteur / 2 - 20, this.largeur, 10);

        ctx.restore();
    }

    shoot() {
        let now = Date.now();
        if (now - this.lastShot > 2000) {
            this.lastShot = now;
            return [
                new Laser(this.x, this.y + this.hauteur / 2, 1, 0, "red"),
                new Laser(this.x, this.y + this.hauteur / 2, 1, 2, "red"),
                new Laser(this.x, this.y + this.hauteur / 2, 1, -2, "red")
            ];
        }
        return [];
    }
}