import objet from "./objet.js";

export default class Bonus extends objet {

    constructor(x, y, couleur, largeur, hauteur, type = "charge") {
        super(x, y, couleur, largeur, hauteur);
        this.speed = 3;
        this.type = type;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.shadowBlur = 15;

        if (this.type === "shield") {
            ctx.shadowColor = "#00ff00";
            ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
        } else {
            ctx.shadowColor = "cyan";
            ctx.fillStyle = "blue";
        }

        ctx.beginPath();
        ctx.arc(0, 0, this.largeur / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 20px Orbitron";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 0;

        if (this.type === "shield") {
            ctx.fillText("S", 0, 2);
        } else {
            ctx.fillText("+", 0, 2);
        }

        ctx.restore();
    }

    move() {
        this.y += this.speed;
    }
}