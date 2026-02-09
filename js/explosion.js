export default class Explosion {
    constructor(x, y, color = "orange") {
        this.particles = [];
        this.life = 30;
        this.color = color;

        let count = (color === "red") ? 100 : 20;

        for (let i = 0; i < count; i++) {
            let speedFactor = (color === "red") ? 20 : 10;
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * speedFactor,
                vy: (Math.random() - 0.5) * speedFactor,
                size: Math.random() * 5 + 2,
                alpha: 1
            });
        }
    }

    update() {
        this.life--;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.03;
            if (p.alpha < 0) p.alpha = 0;
        });
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}
