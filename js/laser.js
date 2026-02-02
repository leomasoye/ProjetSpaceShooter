import objet from "./objet.js";

export default class Laser extends objet {
    constructor(x, y) {
        super(x, y, "cyan", 5, 15);
        this.speed = 10;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.couleur;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.couleur;
        ctx.fillRect(-this.largeur / 2, -this.hauteur / 2, this.largeur, this.hauteur);
        ctx.restore();
    }

    move() {
        this.y -= this.speed;
    }
}