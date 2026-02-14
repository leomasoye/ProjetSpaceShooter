
export const Assets = {
    player: new Image(),
    enemySmall: new Image(),
    enemyMedium: new Image(),
    enemyBoss: new Image(),

    load: function () {
        this.player.src = "assets/images/player.png";
        this.enemySmall.src = "assets/images/enemy.png";
        this.enemyMedium.src = "assets/images/bigEnemy.png";
        this.enemyBoss.src = "assets/images/boss.png";
    }
};

Assets.load();
