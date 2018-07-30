class Dot extends Particle {
    constructor(pos, r = 8, c = "white"){
        super(pos);
        this.rad = r;
        this.color = c;
        this.target = pos.copy();        
        let tempX = (width/2 - sign(random(-1,1)) * random(width/2, width));            
        let tempY = (height/2 + sign(random(-1,1)) * random(height/2, height));
        this.pos = createVector(tempX, tempY);             
    }

    show() {       
        push(); 
        fill(this.color); 
        noStroke();
        ellipse(this.pos.x, this.pos.y, 2 * this.rad); 
        pop();  
        // this.showPath();    
    }

    seekTarget(force, maxSpeed, minSpeed, target = this.target){ //target = this.target){
        let maxForce = force;
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let vel = maxSpeed;
        if (d < 100){
             vel = map(d, 0, 100, minSpeed, maxSpeed);
        }
        desired.setMag(vel);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(maxForce);
        this.applyForce(steer);
    }
    
    runFromTarget(force, dist, target){ //target = this.target){
        let maxSpeed = force/20;
        let maxForce = force;
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let vel = 0;
        let steer = createVector(0,0);
        if (d < dist){
            vel = map(d, 0, dist, maxSpeed, .2);
            desired.setMag(vel);
            steer = p5.Vector.sub(desired, this.vel);
        }
        
        steer.limit(maxForce);
        steer.mult(-1);
        this.applyForce(steer);
    }

    stayAwayFromTarget(dist, target){
        let d = this.pos.dist(target);
        let maxDistanceToOverlap = this.rad + dist;

        if ((d < maxDistanceToOverlap) && (d != 0)){           

            let normal = p5.Vector.sub(target, this.pos);
            normal.normalize();            
            
            // Position corection            
            let percent = 0.7; // usually 20% to 80%
            let slop = 0.02; // usually 0.01 to 0.1
            let penetration = maxDistanceToOverlap - d;
            let correctionMag = max(penetration - slop*maxDistanceToOverlap, 0) / (this.invMass) * percent;
            let correction = p5.Vector.mult(normal, correctionMag);

            this.pos.sub(p5.Vector.mult(correction, this.invMass));
        }
    }

}