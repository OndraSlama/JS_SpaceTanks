class Planet {
    constructor (x, y, r, m = r * r) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.force = createVector(0, 0);
        this.rad = r;        
        this.mass = m;    
        this.invMass = 0;
        this.color = color(20, 20, 50);
    }

    show() {        
        fill(this.color);
        noStroke()        
        ellipse(this.pos.x, this.pos.y, this.rad * 2);      
    }

    move() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc = p5.Vector.div(this.force, this.mass);
        this.force.set(0, 0); 
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

class Moon extends Planet {
    constructor (planet, r, orbit, m = r * r) {        
        let x = planet.pos.x;
        let y = planet.pos.y + planet.rad + orbit;
        super(x, y, r, m)

        this.planet = planet;
        this.orbit = orbit;
        this.invMass = 1/m;
        this.color = color(200);
        this.target;
    } 

    seekTarget(target = this.target){ //target = this.target){
        let maxForce = 200;
        let maxSpeed = 5
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let vel = maxSpeed;
        if (d < 200){
             vel = map(d, 0, 200, 0, maxSpeed);
        }
        desired.setMag(vel);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(maxForce);
        this.applyForce(steer);
    }

}