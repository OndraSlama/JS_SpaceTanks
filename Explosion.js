class Explosion {
    constructor(pos, time, maxR, damage){
        this.pos = pos;
        this.time = time;
        this.maxDiameter = maxR;
        this.r = 0;
        this.alfa = 255;
        this.maxDamage = damage;        
    }

    show(){
        this.r += 5;
        if (this.r > this.maxDiameter) this.r = this.maxDiameter;
        this.alfa -= 255/(this.time * frameRate());        
        
        push();
        fill(200, 10, 10, this.alfa);
        stroke(0, this.alfa);
        ellipse(this.pos.x, this.pos.y, this.r);        
        pop();
    }

    dealDamage(tank){
        let d = this.pos.dist(tank.absolutePos);
        let coverage = this.maxDiameter + tank.hitBoxRadius;
        
        if ((d < coverage/2) && this.maxDamage != 0){ 
            tank.hp -= this.maxDamage * ((coverage - d)/this.maxDiameter);
            this.maxDamage = 0;
        }        
    }

}