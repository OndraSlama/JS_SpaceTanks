class Particle {
    constructor (pos, vel = createVector(0, 0)) {
        this.pos = pos; 
        this.vel = vel;
        this.acc = createVector(0, 0);
        this.force = createVector(0, 0);
        this.rad = 3;        
        this.mass = 5;    
        this.invMass = 1/this.mass;
        this.color = "white";
        this.history = [];
        this.pathLength = 5;
    }

    show() {       
        push(); 
        fill(this.color); 
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.rad*2); 
        pop();   
        this.showPath(); 
    }

    showPath(){
        this.history.push(this.pos.copy());
        if (this.history.length > this.pathLength){
            this.history.splice(0,1);
        }

        push();        
        noStroke();
        fill(this.color);
        for(let i = 0; i < this.history.length; i++){
            if (i % 1 == 0){
                ellipse(this.history[i].x, this.history[i].y, 2 * this.rad*i/this.pathLength);
            }                
        }       
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

    gravityForce(p, pos = this.pos){
        let gravForce = createVector(0, 0);   
        gravForce = p5.Vector.sub(p.pos, pos);
        gravForce.setMag(G * p.mass * this.mass/(gravForce.magSq()));     
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
        if ((this.pos.y > height - this.rad) && (this.vel.y > 0)){
            this.vel.y = -this.vel.y * bounceDamp;
            
            // To avoid endless bouncing
            if(abs(this.vel.y) < 2){
                this.vel.y =this.vel.y * 0.7;
            }
        }

        // Position corection            
        let percent = 0.8 // usually 20% to 80%
        let slop = 0.03 // usually 0.01 to 0.1
        let penetration = max(this.pos.y - (height - this.rad), 0);
        let correctionMag = max(penetration - slop*this.rad, 0) * percent;

        this.pos.y -= correctionMag;        

        // -------------------------------- Right --------------------------------//
        if ((this.pos.x > width - this.rad) && (this.vel.x > 0)){
            this.vel.x = -this.vel.x * bounceDamp;      
        }

        // Position corection 
        penetration = max(this.pos.x - (width - this.rad), 0);
        correctionMag = max(penetration - slop*this.rad, 0) * percent;

        this.pos.x -= correctionMag;

       // -------------------------------- Left --------------------------------//
        if ((this.pos.x < this.rad) && (this.vel.x < 0)){
            this.vel.x = -this.vel.x * bounceDamp; 
        }

        // Position corection 
        penetration = max(this.rad - this.pos.x, 0);
        correctionMag = max(penetration - slop*this.rad, 0) * percent;

        this.pos.x += correctionMag;

        // -------------------------------- Top --------------------------------//
        if ((this.pos.y < this.rad) && (this.vel.y < 0)){
            this.vel.y = -this.vel.y * bounceDamp;            
        }

        // Position corection 
        penetration = max(this.rad - this.pos.y, 0);
        correctionMag = max(penetration - slop*this.rad, 0) * percent;

        this.pos.y += correctionMag;
    }

    wrap(){
         // ------------------------------- Bottom -------------------------------//
        if (this.pos.y > height + this.rad){
            this.pos.y = -this.rad;
        }
        // -------------------------------- Right --------------------------------//
        if (this.pos.x > width + this.rad){
            this.pos.x = -this.rad;      
        }
       // -------------------------------- Left --------------------------------//
        if (this.pos.x < -this.rad){
            this.pos.x = width + this.rad; 
        }
        // -------------------------------- Top --------------------------------//
        if (this.pos.y < -this.rad){
            this.pos.y = height + this.rad;            
        }
    }    

    resolveCollision(other) {
        if (this != other) {
            let d = this.pos.dist(other.pos);
            let maxDistanceToOverlap = this.rad + other.rad;

            if ((d < maxDistanceToOverlap) && (d != 0)) {

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
                if (velAlongNormal > 0) return;

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
                // TO DO

                // Position corection            
                let percent = 0.7; // usually 20% to 80%
                let slop = 0.02; // usually 0.01 to 0.1
                let penetration = maxDistanceToOverlap / 2 - d;
                let correctionMag = max(penetration - slop * maxDistanceToOverlap, 0) / (this.invMass + other.invMass) * percent;
                let correction = p5.Vector.mult(normal, correctionMag);

                this.pos.sub(p5.Vector.mult(correction, this.invMass));
                other.pos.add(p5.Vector.mult(correction, other.invMass));
            }
        }
    }
}

