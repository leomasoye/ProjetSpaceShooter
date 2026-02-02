import objet from "./objet.js";

export default class Player extends objet {

    constructor(x, y, couleur, largeur, hauteur) {
        super(x, y, couleur, largeur, hauteur);
        this.image = new Image();
        this.image.src = "assets/images/player.png";
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(this.angle);

        if (this.image.complete) {
            ctx.drawImage(this.image, -this.largeur / 2, -this.hauteur / 2, this.largeur, this.hauteur);
        } else {
            ctx.fillStyle = this.couleur;
            ctx.beginPath();
            ctx.moveTo(0, -this.hauteur / 2);
            ctx.lineTo(this.largeur / 2, this.hauteur / 2);
            ctx.lineTo(-this.largeur / 2, this.hauteur / 2);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}