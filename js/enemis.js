import objet from "./objet.js";
import { Assets } from "./assets.js";

export default class Enemis extends objet {

    constructor(x, y, couleur, largeur, hauteur, type) {
        super(x, y, couleur, largeur, hauteur);
        this.type = type;
        if (type === "small") {
            this.speed = 2;
            this.image = Assets.enemySmall;
        }
        if (type === "medium") {
            this.speed = 3;
            this.image = Assets.enemyMedium;
        }
        if (type === "large") {
            this.speed = 0.01;
            this.image = Assets.enemyBoss;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.fillStyle = this.couleur;
        ctx.drawImage(this.image, -this.largeur / 2, -this.hauteur / 2, this.largeur, this.hauteur);


        ctx.restore();

    }

    move() {
        this.y += this.speed;
    }
}