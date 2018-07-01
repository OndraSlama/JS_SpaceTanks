class Tank {
    constructor(a, p){        
        this.planet = p;
        this.relativeAngle = 45; //random(0, 2*PI)
        this.relativeVel = 1;
        this.barrelAngle = 45;
        this.barrelVel = 1;
        this.absolutePos = createVector();
        this.absoluteAngle = 0;
        this.hp = 100;
        this.tankSize = 15;
        this.barrelSize = this.tankSize/1.15;
        this.barrelWidth = this.barrelSize/4;
        this.barrelLength = this.barrelSize;        
        this.hitBoxRadius = this.barrelLength*1.2;
        this.shotPower = 0;
        this.parentPlayer;
        this.projectiles = [];
        this.exploded = 0;
    }

    show(){
        let tankWidth = this.tankSize;
        let tankHeight = this.tankSize/2;

        push();
        translate(this.planet.pos);
        rotate(this.relativeAngle);
        translate(this.planet.rad/2, 0);
        translate(tankHeight, 0);
        rotate(this.barrelAngle);

        fill(this.parentPlayer.color);                
        strokeWeight(this.barrelWidth);
        line(0, 0, this.barrelLength, 0);
        rectMode(CENTER);
        rect(this.barrelLength, 0, this.barrelWidth/3, this.barrelWidth/3);        

        rotate(-this.barrelAngle);
        strokeWeight(this.tankSize/10);
        ellipse(0, 0, tankHeight, tankWidth* 2/3);

        translate(-tankHeight, 0); 
        strokeWeight(this.tankSize/10);       
        stroke(0);    
        rectMode(CORNER);
        rect(0, -tankWidth/2, tankHeight, tankWidth);
        ellipse(tankHeight/2, tankWidth/2, tankHeight);
        ellipse(tankHeight/2, -tankWidth/2, tankHeight);
        rect(0, -tankWidth/2, tankHeight, tankWidth);
        noStroke();
        ellipse(tankHeight/2, tankWidth/2, tankHeight - this.tankSize/12, tankHeight/2);
        ellipse(tankHeight/2, -tankWidth/2, tankHeight -this.tankSize/12, tankHeight/2);

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

        let relativeTankVector = p5.Vector.fromAngle(radians(this.relativeAngle), this.planet.rad/2 + this.tankSize/2);
        this.absolutePos = p5.Vector.add(this.planet.pos, relativeTankVector); 

        // Shot
        if (keyIsDown(this.parentPlayer.SHOOT)){
            this.shotPower += .1;
            constrain(this.shotPower, 0.1, 10);
        }else if (this.shotPower > 0){
            this.shoot();
            this.shotPower = 0;
        }
    }

    shoot(){
        let relativeBarrelVector = p5.Vector.fromAngle(radians(this.absoluteAngle), this.barrelLength);
        let pos = p5.Vector.add(this.absolutePos, relativeBarrelVector);
        let shot = p5.Vector.fromAngle(radians(this.absoluteAngle), this.shotPower);
        this.projectiles.push(new Projectile(pos, shot, 5, 10, this.parentPlayer.color));
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

    setPlayer(plr){
        this.parentPlayer = plr;
    }

    explode(){
        if (!this.exploded){
            for (let o = 0; o < 100; o++){
                this.hitBoxRadius = -10;
                let X = random(-10,10);
                let Y = random(-10,10);
                let vel = createVector(X/2,Y/2);
                let pos = createVector(this.absolutePos.x + X, this.absolutePos.y + Y);
                this.projectiles.push(new Projectile(pos, vel, this.tankSize/5, 10, this.parentPlayer.color, 100));
            }
            explosions.push(new Explosion(this.absolutePos, 2, this.tankSize*100, 0));
            this.exploded = 1;
        }
    }

}