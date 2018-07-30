class Explosion {
    constructor(pos, time, maxR, damage){
        this.pos = pos;
        this.time = time;
        this.maxRad = maxR;
        this.rad = 0;
        this.alfa = 255;
        this.maxDamage = damage;        
    }

    show(){
        this.rad += 5;
        if (this.rad > this.maxRad) this.rad = this.maxRad;
        this.alfa -= 255/(this.time * frameRate());        
        
        push();
        fill(150, 50, 50, this.alfa);
        stroke(0, this.alfa);
        ellipse(this.pos.x, this.pos.y, this.rad * 2);        
        pop();
    }

    dealDamage(){
        for (let t of tanks) {
            let d = this.pos.dist(t.absolutePos);
            let maxDistanceToOverlap = this.maxRad + t.hitBoxRadius;

            if ((d < maxDistanceToOverlap) && this.maxDamage != 0) {
                t.hp -= this.maxDamage * ((maxDistanceToOverlap - d) / this.maxRad);
                this.maxDamage = 0;
            }
        }
    }

    disappear(i){
        if (this.alfa <= 0) explosions.splice(i, 1);
    }

}