class Planet {
    constructor (x, y, r, m = r * r) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.force = createVector(0, 0);
        this.rad = r;        
        this.mass = m;    
        this.invMass = 0;
        this.color = 100;
        this.life = 0;
    }

    show() {        
        fill(this.color);        
        ellipse(this.pos.x, this.pos.y, this.rad);      
    }

    move() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc = 0;
    }

    minDistanceToOthers(planets){
        let min = width;
        let temp;
        for(let p of planets){
            if(this.pos != p.pos) temp = this.pos.dist(p.pos);
            if(temp < min) min = temp;            
        }
        return min;
    }
}