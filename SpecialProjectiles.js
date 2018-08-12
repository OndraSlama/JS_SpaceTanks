class ShatterProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
        
    }

    explode() {
        let prevDmg = this.tank.projectileDamage;
        let prevDmgRadius = this.tank.projectileExplosionRadius;

        this.tank.projectileDamage = prevDmg*0.4;
        this.tank.projectileExplosionRadius = prevDmgRadius*0.65;

        this.game.explosions.push(new Explosion(this.pos, 1, this.damageRad*1.5, this.maxDamage, this.game));
        for (let i = 0; i < 4; i++) {
            let angle = radians(this.forceHeading + 180);
            let vel = p5.Vector.fromAngle(angle + random(-50, 50), random(0.6, 1.5));
            let pos = p5.Vector.add(this.pos, p5.Vector.fromAngle(angle, 5));            
            this.tank.projectiles.push(new Projectile(pos, vel, this.tank));
        }

        this.tank.projectileDamage = prevDmg;
        this.tank.projectileExplosionRadius = prevDmgRadius;
    }
}

class TripleProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
        let power = this.tank.shotPower;
        let type = 1;
        let prevDmg = this.tank.projectileDamage;
        this.tank.projectileDamage = prevDmg*0.8;

        setTimeout(function(){
            tank.shoot(power*0.9, type);
        }, 100/gameSpeed);

        setTimeout(function(){
            tank.shoot(power*0.8, type);
        }, 200/gameSpeed);    
        
        this.tank.projectileDamage = prevDmg;
    }
}

class ShotgunProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
        let power = this.tank.shotPower;
        let type = 1;
        let prevAngle = tank.barrelAngle;
        let prevDmg = tank.projectileDamage;

        tank.projectileDamage = prevDmg*0.4

        for(let i = 0; i < 5; i++){
            tank.barrelAngle = prevAngle + 3*(i-2)
            tank.shoot(power, type);
        }   
        
        tank.barrelAngle = prevAngle;
        tank.projectileDamage = prevDmg;
           
    }
}

class ChainProjectile extends Projectile {
    constructor(pos, vel, tank, chains = 5) {
        super(pos, vel, tank);
        this.life = 1;
        this.chains = chains;
        
    }

    explode() {         
        this.game.explosions.push(new Explosion(this.pos, 1, this.damageRad, this.maxDamage, this.game));       
        if(this.chains > 0){
            // let X = random(-5, 5);
            // let Y = random(-5, 5);
            let angle = radians(this.forceHeading + 180);
            let vel = p5.Vector.fromAngle(angle, 4);
            let pos = p5.Vector.add(this.pos, p5.Vector.fromAngle(angle, 5));
            this.tank.projectiles.push(new ChainProjectile(pos, vel, this.tank, --this.chains));
        }        
    }
}