import objet from "./objet.js";

export default class Player extends objet {

    constructor(x, y, couleur, largeur, hauteur) {
        super(x, y, couleur, largeur, hauteur);
    }  

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.couleur;

        ctx.beginPath();

        ctx.restore();

    }
}