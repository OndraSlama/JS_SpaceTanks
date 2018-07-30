class Tank {
    constructor(a, p){        
        // Tank parameters
        this.planet = p;
        this.relativeAngle = 45; //random(0, 2*PI)
        this.relativeVel = 1;
        this.barrelAngle = 45;
        this.barrelVel = 1;
        this.absolutePos = createVector();
        this.absoluteAngle = 0;
        this.tankSize = width*0.025;
        this.barrelLength = this.tankSize/1.15;
        this.barrelWidth = this.barrelLength/4;      
        this.hitBoxRadius = this.tankSize*0.5;
        this.shotPower = 0;
        this.maxShotPower = 10;
        this.hp = 100;
        
        // Statuses
        this.exploded = 0;

        // Objects
        this.parentPlayer;
        this.projectiles = [];
        this.ruins = [];

        // Projectile parameters
        this.projectileDamage = 20;
        this.projectileExplosionRadius = this.tankSize;
        this.projectileLife = 5;
        this.projectileRadius = this.tankSize*0.15;
        this.projectileMass = 8;  
        
        // Trajectory
        this.trajectoryLength = 15;
        this.trajectory = [];
    }

    show(){
        let tankWidth = this.tankSize;
        let tankHeight = this.tankSize/2;

        //             //           
        //            //
        //         __//_
        //      __/__.__\__     _
        //    /      2      \    |
        //    \ _____._____ /   _| tankHeight
        //           1
        //      |_________|
        //       tankWidth

        push();

        // Draw tank
        translate(this.planet.pos); // center of planet 
        rotate(this.relativeAngle); // rotate so that X axis is parallel with tankAngle
        translate(this.planet.rad, 0); // translate to the edge of planet where the tank sits (point 1)
        translate(tankHeight, 0); // translate to point 2
        rotate(this.barrelAngle); // rotate so the barrel is parallel with X axis

        fill(this.parentPlayer.color);                
        strokeWeight(this.barrelWidth); 
        line(0, 0, this.barrelLength, 0); // draw barrel
        rectMode(CENTER);
        rect(this.barrelLength, 0, this.barrelWidth/3, this.barrelWidth/3);  // draw the tip of the barrel  

        rotate(-this.barrelAngle); // rotate back to tank Angle
        strokeWeight(this.tankSize/10);
        ellipse(0, 0, tankHeight, tankWidth* 2/3); // draw cokpit

        translate(-tankHeight, 0); // translate back to point 1
        strokeWeight(this.tankSize/10);       
        stroke(0);    
        rectMode(CORNER);
        ellipse(tankHeight/2, tankWidth/2, tankHeight); // draw rounded ends of the body
        ellipse(tankHeight/2, -tankWidth/2, tankHeight); 
        rect(0, -tankWidth/2, tankHeight, tankWidth); // draw body of the tank
        noStroke();
        ellipse(tankHeight/2, tankWidth/2, tankHeight - this.tankSize/12, tankHeight/2); // for fixing odd look
        ellipse(tankHeight/2, -tankWidth/2, tankHeight -this.tankSize/12, tankHeight/2);

        // Draw power bar
        let powerBarLength = map(this.shotPower, 0.1, this.maxShotPower, 0, this.tankSize * 1.2)
        if (powerBarLength < 0) powerBarLength = 0;        

        fill(this.parentPlayer.color);
        rect(-tankHeight * 0.8, -tankWidth * 0.6, tankHeight * 0.5, powerBarLength);
        pop();        
    }

    control(){

        // Movement
        if (keyIsDown(this.parentPlayer.LEFT)) this.relativeAngle += this.relativeVel;
        if (keyIsDown(this.parentPlayer.RIGHT)) this.relativeAngle -= this.relativeVel;
        if (keyIsDown(this.parentPlayer.CW)) this.barrelAngle += this.barrelVel;
        if (keyIsDown(this.parentPlayer.CCW)) this.barrelAngle -= this.barrelVel;

        if(abs(this.barrelAngle) > 90) this.barrelAngle = sign(this.barrelAngle)*90;

        // Update absolute position
        this.absoluteAngle = this.relativeAngle + this.barrelAngle; 

        let relativeTankVector = p5.Vector.fromAngle(radians(this.relativeAngle), this.planet.rad + this.tankSize/2);
        this.absolutePos = p5.Vector.add(this.planet.pos, relativeTankVector); 

        // Shot
        if (keyIsDown(this.parentPlayer.SHOOT)){
            this.shotPower += .05;
            if (this.shotPower > this.maxShotPower) this.shotPower = this.maxShotPower;
            // Draw trajectory
            this.showTrajectory();
        }else if (this.shotPower > 0){
            this.shoot();
            this.shotPower = 0;
        }
    }

    shoot(){
        let relativeBarrelVector = p5.Vector.fromAngle(radians(this.absoluteAngle), this.barrelLength);        
        let pos = p5.Vector.add(this.absolutePos, relativeBarrelVector);
        let shot = p5.Vector.fromAngle(radians(this.absoluteAngle), this.shotPower);
        this.projectiles.push(new Projectile(pos, shot, this));
    }

    updateProjectiles(other){
        for(let q = this.projectiles.length - 1; q >= 0; q--){       
            for(let j = q; j >= 0; j--){
                if (this.projectiles[q] != this.projectiles[j]){
                    this.projectiles[q].resolveCollision(this.projectiles[j]);
                }
            }
            for(let k of planets){
                this.projectiles[q].resolveCollision(k);
            } 
            for(let l of other.projectiles){
                if (this != other){
                    this.projectiles[q].resolveCollision(l);
                }
            }  
            for(let t of tanks){
                this.projectiles[q].resolveHit(t);
            }  

            this.projectiles[q].wrap();
            this.projectiles[q].gravityForce();
            this.projectiles[q].airResistance();
            this.projectiles[q].move();        
            this.projectiles[q].show();              
            if(this.projectiles[q].life <= 0){
                this.projectiles[q].explode();
                this.projectiles.splice(q,1);
            } 
        }
    }

    updateRuins(other){
        for(let q = this.ruins.length - 1; q >= 0; q--){       
            for(let j = q; j >= 0; j--){
                if (this.ruins[q] != this.ruins[j]){
                    this.ruins[q].resolveCollision(this.ruins[j]);
                }
            }
            for(let k of planets){
                this.ruins[q].resolveCollision(k);
            } 
            for(let l of other.projectiles){
                if (this != other){
                    this.ruins[q].resolveCollision(l);
                }
            }  

            this.ruins[q].wrap();
            this.ruins[q].gravityForce();
            this.ruins[q].airResistance();
            this.ruins[q].move();        
            this.ruins[q].show();          
           
        }
    }

    setPlayer(player){
        this.parentPlayer = player;
    }

    explode(){
        if (!this.exploded){
            for (let o = 0; o < 40; o++){
                let X = random(-10,10);
                let Y = random(-10,10);
                let vel = createVector(X*0.6,Y*0.6);
                let pos = createVector(this.absolutePos.x + X, this.absolutePos.y + Y);
                this.projectiles.push(new Ruin(pos, vel, this));
            }
            explosions.push(new Explosion(this.absolutePos, 2, this.tankSize*100, 0));
            this.exploded = 1;
        }
    }

    showTrajectory(){
        this.trajectory.splice(0, this.trajectory.length);
        let relativeBarrelVector = p5.Vector.fromAngle(radians(this.absoluteAngle), this.barrelLength);        
        let pos = p5.Vector.add(this.absolutePos, relativeBarrelVector);
        let shot = p5.Vector.fromAngle(radians(this.absoluteAngle), this.shotPower);
        let particle = new Projectile(pos, shot, this);
        let showEvery = 8;

        for(let i = 0; i < showEvery*this.trajectoryLength; i++ ){

            for(let k of planets){
                particle.resolveCollision(k);
            }            
            
            particle.wrap();
            particle.gravityForce();
            particle.airResistance();
            particle.move();

            if (i % showEvery == 0){
                this.trajectory.push(particle.pos.copy());
            }
        }
        for(let t of this.trajectory){
            push();
            fill(particle.color);
            stroke(0);
            ellipse(t.x, t.y, particle.rad * 0.5);
            pop()
        }
    }

}