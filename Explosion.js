class Explosion {
    constructor(pos, color, time, maxR, damage, game){
        this.game = game;
        this.pos = pos;
        this.color = color;
        this.time = time;
        this.maxRad = maxR;
        this.rad = 0;
        this.alfa = 255;
        this.maxDamage = damage;        
    }

    show(){   
        push();
        this.color = color(this.color);
        this.color._array[3] = this.alfa/255;
        fill(this.color);
        stroke(0, this.alfa);
        // noStroke();
        ellipse(this.pos.x, this.pos.y, this.rad * 2);        
        pop();
    }

    update(){
        this.rad += 2;
        if (this.rad > this.maxRad) this.rad = this.maxRad;
        this.alfa -= 255/(this.time * frameRate());
    }

    dealDamage(){
        for (let t of this.game.tanks) {
            let d = this.pos.dist(t.pos);
            let maxDistanceToOverlap = this.maxRad + t.hitBoxRadius;

            if ((d < maxDistanceToOverlap) && this.maxDamage != 0) {
                t.hp -= this.maxDamage * ((maxDistanceToOverlap - d) / this.maxRad);                
            }
        }
        this.maxDamage = 0;
    }


}