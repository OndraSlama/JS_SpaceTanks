class ShatterProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
    }

    explode() {
        for (let i = 0; i < 4; i++) {
            let X = random(-5, 5);
            let Y = random(-5, 5);
            let vel = createVector(X * 0.20, Y * 0.20);
            let pos = createVector(this.pos.x + X, this.pos.y + Y);
            this.tank.projectiles.push(new Projectile(pos, vel, this.tank));
        }
    }
}

class TripleProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
        let power = this.tank.shotPower;
        let type = 1;
        setTimeout(shootWithTank, 100/gameSpeed,this.tank, power*0.8, type);
        setTimeout(shootWithTank, 200/gameSpeed,this.tank, power*0.6, type);       
    }
}

function shootWithTank(tank, power, type){
    tank.shoot(power, type);
}