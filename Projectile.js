class Projectile extends Particle{
    constructor (pos, vel = createVector(0, 0), tank) {
        super(pos, vel);
        this.game = tank.game;
        this.tank = tank;
        this.rad = tank.projectileRadius;
        this.color = tank.parentPlayer.color;
        this.mass = tank.projectileMass
        this.invMass = 1/this.mass;
        this.pathLength = 200;
        this.life = tank.projectileLife;
        this.damageRad = tank.projectileExplosionRadius;
        this.maxDamage = tank.projectileDamage;
    }   
    
    resolveHit(tank){
        let d = this.pos.dist(tank.pos);
        let coverage = this.rad + tank.hitBoxRadius;
        if (d < coverage){ 
            this.life = 0;
        }
    }

    explode(){
        this.game.explosions.push(new Explosion(this.pos, this.color, 1, this.damageRad, this.maxDamage, this.game));
    }

    updatePath(){
        this.history.push(this.pos.copy());
    }

    showPath(){    
        push();
        noStroke();
        fill(this.color);
        for(let i = 0; i < this.history.length; i++){
            let treshold = this.history.length - 20;
            if (i > treshold){
                ellipse(this.history[i].x, this.history[i].y, 2 * this.rad*(i - treshold)/20);
            }else if(i % 6 == 0){
                ellipse(this.history[i].x, this.history[i].y, 2 * this.rad/3);
            }
        }
        pop();
    }    

    resolveLife(other){
       if(this.tank == other.tank) return
       this.life--;
    }
}

