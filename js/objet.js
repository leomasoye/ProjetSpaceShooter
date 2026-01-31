export default class objet {
    x = 0;
    y = 0;
    couleur = "black";
    largeur = 5;
    hauteur = 5;

    constructor(x, y, couleur, largeur, hauteur) {
        this.x = x;
        this.y = y;
        this.couleur = couleur;
        this.largeur = largeur;
        this.hauteur = hauteur;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.couleur;
        ctx.arc(this.x, this.y, this.largeur / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    moveAbsolute(x, y) {
        this.x = x;
        this.y = y;
    }
}