export default class objet {
    x = 0;
    y = 0;
    angle = 0;
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

        ctx.translate(this.x, this.y);

        ctx.rotate(this.angle);

        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(0, 0, this.largeur / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }



    collide(other) {
        if (Math.abs(this.x - other.x) < (this.largeur + other.largeur) / 2 && Math.abs(this.y - other.y) < (this.hauteur + other.hauteur) / 2) {
            return true;
        }
        return false;
    }
}