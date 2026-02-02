import objet from "./objet.js";

export default class Enemis extends objet {

    constructor(x, y, couleur, largeur, hauteur, type) {
        super(x, y, couleur, largeur, hauteur);
        this.type = type;
        this.speed = 2;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.couleur;

        ctx.beginPath();

        ctx.restore();

    }

    move() {
        this.y += this.speed;
    }
}