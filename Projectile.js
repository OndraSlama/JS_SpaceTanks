class Projectile {
    constructor (pos, vel = createVector(0, 0), r = 8, m = r, c = "white", life = 5) {
        this.pos = pos; 
        this.vel = vel;
        this.acc = createVector(0, 0);
        this.force = createVector(0, 0);
        this.rad = r;        
        this.mass = m;    
        this.invMass = 1/m;
        this.color = c;
        this.life = life;
        this.damageRad = 10;
        this.maxDamage = 10;
    }

    show() {       
        push(); 
        fill(this.color); 
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.rad); 
        pop();      
    }

    move() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc = p5.Vector.div(this.force, this.mass);
        this.force.set(0, 0);       
    }

    applyForce(force){
        this.force.add(force);
    }

    gravityForce(){
        let gravForce = createVector(0, 0);        
        for(let p of planets){
            let tempForce = createVector();
            tempForce = p5.Vector.sub(p.pos, this.pos);
            tempForce.setMag(G * p.mass * this.mass/(tempForce.magSq())); 
            gravForce.add(tempForce);           
        }        
        this.applyForce(gravForce);
    }

    airResistance(){
        let airResist = createVector();
        airResist.x = -sign(this.vel.x) * (this.vel.x * this.vel.x) * airDamp;
        airResist.y = -sign(this.vel.y) * (this.vel.y * this.vel.y) * airDamp;

        this.applyForce(airResist);
    }  

    bounce() {
        // -------------------------------- Bottom --------------------------------//
        if ((this.pos.y > height - this.rad/2) && (this.vel.y > 0)){
            this.vel.y = -this.vel.y * bounceDamp;
            
            // To avoid endless bouncing
            if(abs(this.vel.y) < 2){
                this.vel.y =this.vel.y * 0.7;
            }
        }

        // Position corection            
        let percent = 0.8 // usually 20% to 80%
        let slop = 0.03 // usually 0.01 to 0.1
        let penetration = max(this.pos.y - (height - this.rad/2), 0);
        let correctionMag = max(penetration - slop*this.rad/2, 0) * percent;

        this.pos.y -= correctionMag;        

        // -------------------------------- Right --------------------------------//
        if ((this.pos.x > width - this.rad/2) && (this.vel.x > 0)){
            this.vel.x = -this.vel.x * bounceDamp;      
        }

        // Position corection 
        penetration = max(this.pos.x - (width - this.rad/2), 0);
        correctionMag = max(penetration - slop*this.rad/2, 0) * percent;

        this.pos.x -= correctionMag;

       // -------------------------------- Left --------------------------------//
        if ((this.pos.x < this.rad/2) && (this.vel.x < 0)){
            this.vel.x = -this.vel.x * bounceDamp; 
        }

        // Position corection 
        penetration = max(this.rad/2 - this.pos.x, 0);
        correctionMag = max(penetration - slop*this.rad/2, 0) * percent;

        this.pos.x += correctionMag;

        // -------------------------------- Top --------------------------------//
        if ((this.pos.y < this.rad/2) && (this.vel.y < 0)){
            this.vel.y = -this.vel.y * bounceDamp;            
        }

        // Position corection 
        penetration = max(this.rad/2 - this.pos.y, 0);
        correctionMag = max(penetration - slop*this.rad/2, 0) * percent;

        this.pos.y += correctionMag;
    }

    wrap(){
         // ------------------------------- Bottom -------------------------------//
        if (this.pos.y > height + this.rad/2){
            this.pos.y = -this.rad/2;
        }
        // -------------------------------- Right --------------------------------//
        if (this.pos.x > width + this.rad/2){
            this.pos.x = -this.rad/2;      
        }
       // -------------------------------- Left --------------------------------//
        if (this.pos.x < -this.rad/2){
            this.pos.x = width + this.rad/2; 
        }
        // -------------------------------- Top --------------------------------//
        if (this.pos.y < -this.rad/2){
            this.pos.y = height + this.rad/2;            
        }
    }    

    intersects(other){
        let d = this.pos.dist(other.pos);
        return (d < (this.rad + other.rad)/2);
    }

    resolveCollision(other){
        let d = this.pos.dist(other.pos);
        let coverage = this.rad + other.rad;

        if ((d < coverage/2) && (d != 0)){   
            
            // Sub one from lifecounter
            this.life--;

            //------------ IMPACT --------------//     

            // Calculate relative velocity
            let rv = p5.Vector.sub(other.vel, this.vel);
            let normal = p5.Vector.sub(other.pos, this.pos);
            normal.normalize();
            
            // Calculate relative velocity in terms of the normal direction
            let velAlongNormal = p5.Vector.dot(rv, normal)
            
            // Do not resolve if velocities are separating
            if(velAlongNormal > 0) return;
            
            // Calculate restitution
            let e = impulseDamp;
            
            // Calculate impulse scalar
            let j = -(1 + e) * velAlongNormal;
            j /= this.invMass + other.invMass;
            
            // Apply impulse
            let impulse = p5.Vector.mult(normal, j);
            this.vel.sub(p5.Vector.mult(impulse, this.invMass));
            other.vel.add(p5.Vector.mult(impulse, other.invMass)); 

            //------------ FRICTION --------------// 
            
            // Position corection            
            let percent = 0.7; // usually 20% to 80%
            let slop = 0.02; // usually 0.01 to 0.1
            let penetration = coverage/2 - d;
            let correctionMag = max(penetration - slop*coverage, 0) / (this.invMass + other.invMass) * percent;
            let correction = p5.Vector.mult(normal, correctionMag);

            this.pos.sub(p5.Vector.mult(correction, this.invMass));
            other.pos.add(p5.Vector.mult(correction, other.invMass));
        }        
    }

     resolveHit(tank){
        let d = this.pos.dist(tank.absolutePos);
        let coverage = this.rad + tank.hitBoxRadius;
        if (d < coverage/2){ 
            this.life = 0;
        }
    }

    explode(){
        explosions.push(new Explosion(this.pos, 1, this.damageRad*2, this.maxDamage));
    }
}

class Dot extends Projectile {
    constructor(pos, r = 8, c = "white"){
        super(pos, createVector(0, 0), r, r, c);

        this.target = pos.copy();
        let tempX = (width/2 - sign(random(-1,1)) * random(width/2, width));            
        let tempY = (height/2 + sign(random(-1,1)) * random(height/2, height));
        this.pos = createVector(tempX, tempY);             
    }

    show() {       
        push(); 
        fill(this.color); 
        stroke(0);
        ellipse(this.pos.x, this.pos.y, this.rad); 
        pop();      
    }

    seekTarget(target = this.target){ //target = this.target){
        let maxSpeed = 7;
        let maxForce = 100;
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let vel = maxSpeed;
        if (d < 100){
             vel = map(d, 0, 100, 0.3, maxSpeed);
        }
        desired.setMag(vel);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(maxForce);
        this.applyForce(steer);
    }
    
    runFromTarget(target, force, dist){ //target = this.target){
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
}