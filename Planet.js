class Planet extends Particle {
    constructor (x, y, r, m = r * r) {

        super(createVector(x,y));
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

class Moon extends Particle {
    constructor (planet, r = random(planet.rad/3, planet.rad/2.5), orbit = random(50, 80), m = r*r) {

        let angle = 90;

        let relativePos = p5.Vector.fromAngle(radians(angle), planet.rad + orbit);
        let pos = p5.Vector.add(relativePos, planet.pos);

        super(pos);
        
        this.planet = planet;

        this.orbitVelocity = random(-.4, .4);

        this.target = pos.copy();
        this.angle = 90;
        this.rad = r;
        this.orbit = orbit;
        this.mass = 50;
        this.invMass = 1/m;
        this.color = color(200);
    }

    show() {       
        push(); 
        fill(this.color); 
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.rad*2); 
        pop();   
    }
    

    seekTarget(maxSpeed, minSpeed = 0, target = this.target){
        let maxForce = 100;

        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let vel = maxSpeed;
        if (d < 600){
             vel = map(d, 0, 200, minSpeed, maxSpeed);
        }
        desired.setMag(vel);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(maxForce);
        this.applyForce(steer);
    }

    orbitPlanet(){
        this.angle += this.orbitVelocity;
        let relativePos = p5.Vector.fromAngle(radians(this.angle), this.planet.rad + this.orbit);
        this.target = p5.Vector.add(relativePos, this.planet.pos);
    }
}