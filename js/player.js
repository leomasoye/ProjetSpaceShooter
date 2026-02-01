import objet from "./objet.js";

export default class Player extends objet {

    constructor(x, y, couleur, largeur, hauteur) {
        super(x, y, couleur, largeur, hauteur);
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(this.angle);

        ctx.fillStyle = this.couleur;

        ctx.beginPath();
        ctx.moveTo(0, -this.hauteur / 2);
        ctx.lineTo(this.largeur / 2, this.hauteur / 2);
        ctx.lineTo(-this.largeur / 2, this.hauteur / 2);

        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}