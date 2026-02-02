import objet from "./objet.js";
import Laser from "./laser.js";

export default class boss extends objet {

    constructor(x, y, couleur, largeur, hauteur) {
        super(x, y, couleur, largeur, hauteur);
        this.speed = 0.1;
        this.dx = 1;
        this.image = new Image();
        this.image.src = "assets/images/boss.png";
        this.life = 100;
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
        if (this.y < 100) {
            this.y += this.speed;
        } else {
            this.x += this.dx;
            if (this.x > canvasWidth - this.largeur / 2 || this.x < 0 + this.largeur / 2) {
                this.dx = -this.dx;
            }
        }
    }

    shoot() {
        let now = Date.now();
        if (now - this.lastShot > 1000) {
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