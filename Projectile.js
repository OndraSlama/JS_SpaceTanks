class Projectile extends Particle{
    constructor (pos, vel = createVector(0, 0), tank) {
        super(pos, vel);
        this.game = tank.game;
        this.rad = tank.projectileRadius;
        this.color = tank.parentPlayer.color;
        this.mass = tank.projectileMass
        this.invMass = 1/this.mass;
        this.pathLength = 200;
        this.life = tank.projectileLife;
        this.damageRad = tank.projectileDamage;
        this.maxDamage = tank.projectileExplosionRadius;
    }   
    
    resolveHit(tank){
        let d = this.pos.dist(tank.pos);
        let coverage = this.rad + tank.hitBoxRadius;
        if (d < coverage){ 
            this.life = 0;
        }
    }

    explode(){
        this.game.explosions.push(new Explosion(this.pos, 1, this.damageRad, this.maxDamage, this.game));
    }

    showPath(){
        this.history.push(this.pos.copy());
        //if (this.history.length > this.pathLength){
        //    this.history.splice(0,1);
        //}

        push();
        noStroke();
        fill(this.color);
        for(let i = 0; i < this.history.length; i++){
            let treshold = this.history.length - 10;
            if (i > treshold){
                ellipse(this.history[i].x, this.history[i].y, 2 * this.rad*(i - treshold)/10);
            }else if(i % 6 == 0){
                ellipse(this.history[i].x, this.history[i].y, 2 * this.rad/3);
            }
        }
        pop();
    }    
}

