class ShatterProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
        
    }

    explode() {
        let prevDmg = this.tank.projectileDamage;
        let prevDmgRadius = this.tank.projectileExplosionRadius;

        this.tank.projectileDamage = prevDmg*0.4;
        this.tank.projectileExplosionRadius = prevDmgRadius*0.65;

        this.game.explosions.push(new Explosion(this.pos, this.color, 1, this.damageRad*1.5, this.maxDamage, this.game));
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
        this.rad = tank.projectileRadius*0.4;
        let power = this.tank.shotPower;
        let type = 1;
        let prevAngle = tank.barrelAngle;
        let prevDmg = tank.projectileDamage;
        let prevRad = tank.projectileRadius;

        tank.projectileDamage = prevDmg*0.4
        tank.projectileRadius = prevRad*0.4;

        for(let i = 0; i < 4; i++){
            tank.barrelAngle = prevAngle + 4*(i-2) + 1
            tank.shoot(power, type);
        }   
        
        tank.barrelAngle = prevAngle;
        tank.projectileDamage = prevDmg;
        tank.projectileRadius = prevRad;
           
    }
}

class ChainProjectile extends Projectile {
    constructor(pos, vel, tank, chains = 3) {
        super(pos, vel, tank);
        this.life = 1;
        this.chains = chains;
        
    }

    explode() {         
        this.game.explosions.push(new Explosion(this.pos, this.color, 1, this.damageRad, this.maxDamage, this.game));       
        if(this.chains > 0){
            let angle = radians(this.forceHeading + 180);
            let vel = p5.Vector.fromAngle(angle, 4);
            let pos = p5.Vector.add(this.pos, p5.Vector.fromAngle(angle, 5));
            this.tank.projectiles.push(new ChainProjectile(pos, vel, this.tank, --this.chains));
        }        
    }
}

class GuidedProjectile extends Projectile {
    constructor(pos, vel, tank) {
        super(pos, vel, tank);
        this.life = 1; 
        for(let t of this.tank.game.tanks){
            if(t != this.tank) this.target = t.pos;
        }      
    }

    move() {
        this.seekTarget(5, 2)
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc = p5.Vector.div(this.force, this.mass);
        this.forceHeading = this.force.heading();
        this.force.set(0, 0);         
        this.updatePath();
    }

    seekTarget(maxSpeed, minSpeed = 0, target = this.target){
        
        let maxForce = .1;

        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let vel = maxSpeed;
        if (d < 200){
             vel = map(d, 0, 200, minSpeed, maxSpeed);
        }
        desired.setMag(vel);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(maxForce);
        this.applyForce(steer);
    }

    explode() {         
        this.game.explosions.push(new Explosion(this.pos, this.color, 1, this.damageRad, this.maxDamage, this.game));       
        if(this.chains > 0){
            let angle = radians(this.forceHeading + 180);
            let vel = p5.Vector.fromAngle(angle, 4);
            let pos = p5.Vector.add(this.pos, p5.Vector.fromAngle(angle, 5));
            this.tank.projectiles.push(new ChainProjectile(pos, vel, this.tank, --this.chains));
        }        
    }
}