class Tank extends Particle {
    constructor(planet, player, game){    
        let pos = planet.pos.copy();
        pos.x += planet.rad;
        super(pos);
        
        // Object references
        this.game = game;
        this.planet = planet;
        this.parentPlayer = player;

        // Tank parameters
        this.mass = player.maxHp/3;
        this.invMass = 1/this.mass;
        this.maxAcc = 1;     
        this.maxVel = 1;   
        this.maxHp = player.maxHp;
        this.hp = player.maxHp;
        this.tankSize = player.tankSize * 0.005 * (100 + this.maxHp);
        this.tankSize = constrain(this.tankSize, 8, 25);
        this.barrelLength = this.tankSize;
        this.barrelWidth = this.barrelLength * 0.25;      
        this.hitBoxRadius = this.tankSize*0.5;
        this.maxShotPower = player.maxShotPower;
        
        // State variables
        this.barrelPos = createVector();
        this.rad = this.hitBoxRadius;
        this.shotPower = 0;
        this.relativeAngle = random(0, 360);
        this.relativeVel = 1;
        this.barrelAngle = 0;
        this.barrelVel = 1;
        this.absoluteAngle = 0;

        // Statuses
        this.exploded = 0;
        this.onPlanet = 1;

        // Objects
        this.projectiles = [];
        this.ruins = [];

        // Projectile parameters
        this.projectileType = player.projectileType;
        this.projectileDamage = player.projectileDamage;
        this.projectileExplosionRadius = player.projectileExplosionRadius;
        this.projectileLife = player.projectileLife;
        this.projectileRadius = player.projectileRadius + 0.02*this.projectileExplosionRadius;
        this.projectileMass = player.projectileMass + 0.02*this.projectileDamage;  
        
        // Trajectory
        this.trajectoryLength = 15;
        this.trajectory = [];
    }

    show(){
        let tankWidth = this.tankSize * 1.5;
        let tankHeight = this.tankSize/2;

        //             //           
        //            //
        //         __//_
        //      __/__.__\__     _
        //    /      2      \    |
        //    \ _____*_____ /   _| tankHeight
        //           1
        //      |_________|
        //       tankWidth

        push();

        // Draw tank
        
        translate(this.pos); // center of planet 
        rotate(this.forceHeading + 180); // rotate so that X axis is parallel with tankAngle
        // translate(this.planet.rad, 0); // translate to the edge of planet where the tank sits (point 1)
        // translate(tankHeight/2, 0); // translate to point 2
        rotate(this.barrelAngle); // rotate so the barrel is parallel with X axis

        // Draw barrel
        fill(this.parentPlayer.color);
        strokeWeight(this.barrelWidth);       
        stroke(60);
        line(0, 0, this.barrelLength, 0); 
        rectMode(CENTER);
        rect(this.barrelLength, 0, this.barrelWidth/3, this.barrelWidth/3);  // draw the tip of the barrel 
        
        // Draw power bar        
        stroke(this.parentPlayer.color);
        let powerBarLength = map(this.shotPower, 0.1, this.maxShotPower, tankHeight*0.4, this.barrelLength + this.barrelWidth/3)
        if (powerBarLength < 0) powerBarLength = 0;        
        line(0, 0, powerBarLength, 0); // draw barrel
        
        let tipOfBarrelLength = powerBarLength - (this.barrelLength - this.barrelWidth/3);
        if (tipOfBarrelLength < 0) tipOfBarrelLength = 0;
        rectMode(CORNER);   
        rect(-this.barrelWidth/3, -this.barrelWidth/3, tipOfBarrelLength, this.barrelWidth/3);

        // stroke("black");
        noStroke();
        // strokeWeight(this.tankSize/10);
        rotate(-this.barrelAngle); // rotate back to tank Angle
        ellipse(0, 0, tankHeight, tankWidth* 0.5); // draw cokpit

        translate(-tankHeight, 0); // translate back to point 1
        rectMode(CORNER);
        
        rect(0, -tankWidth/2, tankHeight, tankWidth, tankHeight*0.6, tankHeight*0.6); // draw body of the tank
        noStroke();
        

        // Draw power bar
        let healthBarLength = map(this.hp, 0, this.maxHp, 0, tankWidth);       
        fill(this.parentPlayer.color);
        rect(-tankHeight * 0.8, -tankWidth * 0.5, tankHeight * 0.5, healthBarLength);
        pop();     
        
        // Draw trajectory
        if (keyIsDown(this.parentPlayer.SHOOT)){            
            this.showTrajectory()
        }        
    }

    control(){

        // Movement
        if (keyIsDown(this.parentPlayer.LEFT) && this.onPlanet){
            let acceleration = p5.Vector.fromAngle(radians(this.forceHeading - 90), this.maxAcc);
            this.acc.add(acceleration);
        }        
        if (keyIsDown(this.parentPlayer.RIGHT) && this.onPlanet){
            let acceleration = p5.Vector.fromAngle(radians(this.forceHeading + 90), this.maxAcc);
            this.acc.add(acceleration);
        }        
        if (keyIsDown(this.parentPlayer.JUMP) && this.onPlanet){
            let acceleration = p5.Vector.fromAngle(radians(this.forceHeading + 180), this.maxAcc);
            this.acc.add(acceleration);
            this.pos.add(p5.Vector.fromAngle(radians(this.forceHeading + 180), 2));
            this.onPlanet = false;            
        }
        if (keyIsDown(this.parentPlayer.CW)) this.barrelAngle += this.barrelVel;
        if (keyIsDown(this.parentPlayer.CCW)) this.barrelAngle -= this.barrelVel;


        if(abs(this.barrelAngle) > 90) this.barrelAngle = sign(this.barrelAngle)*90;

        // Update absolute position
        this.updatePositions();

        // Shot
        if (keyIsDown(this.parentPlayer.SHOOT)){
            this.shotPower += .05;
            if (this.shotPower > this.maxShotPower) this.shotPower = this.maxShotPower;
        }else if (this.shotPower > 0){
            this.shoot();
            this.shotPower = 0;
        }
    }

    move() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        if(this.onPlanet) this.vel.limit(this.maxVel);
        this.acc = p5.Vector.div(this.force, this.mass);
        this.forceHeading = this.force.heading();
        this.dynamicTankBehaviour();
        this.force.set(0, 0);    
    }

    dynamicTankBehaviour(){
        for(let p of this.game.planets){
            if(p.pos.dist(this.pos) < p.rad + this.rad + 2){
                this.forceHeading = p5.Vector.sub(p.pos, this.pos).heading();
                this.onPlanet = true;
                this.planet = p;
                this.vel.mult(0.8);
            }            
        }

        for(let m of this.game.moons){
            if(m.pos.dist(this.pos) < m.rad + this.rad + 3){
                this.forceHeading = p5.Vector.sub(m.pos, this.pos).heading();
                this.onPlanet = true;
                this.planet = m;
                this.vel.mult(0.8);
            }            
        }
        
        let dist = this.planet.pos.dist(this.pos);
        let touchingDistance = this.planet.rad + this.rad;

        if(dist > touchingDistance + 2 && this.onPlanet){
            this.pos.add(p5.Vector.fromAngle(radians(this.forceHeading), .5))        
        }

        if(dist > touchingDistance + 5 && this.onPlanet){
            this.onPlanet = false;
        }
    }

    updatePositions(){
        this.absoluteAngle = this.forceHeading + 180 + this.barrelAngle; 
        let relativeBarrelVector = p5.Vector.fromAngle(radians(this.absoluteAngle), this.barrelLength);        
        this.barrelPos = p5.Vector.add(this.pos, relativeBarrelVector);
    }

    shoot(power = this.shotPower, type = this.projectileType){    
        this.updatePositions();    
        let shot = p5.Vector.fromAngle(radians(this.absoluteAngle), power);
        switch (type) {
            case 1:
                this.projectiles.push(new Projectile(this.barrelPos, shot, this));
                break;
            case 2:
                this.projectiles.push(new ShatterProjectile(this.barrelPos, shot, this));
                break;
            case 3:
                this.projectiles.push(new TripleProjectile(this.barrelPos, shot, this));
                break;
            case 4:
                this.projectiles.push(new ShotgunProjectile(this.barrelPos, shot, this));
                break;
            case 5:
                this.projectiles.push(new ChainProjectile(this.barrelPos, shot, this));
                break;
            case 6:
                this.projectiles.push(new GuidedProjectile(this.barrelPos, shot, this));
                break;
            
            default:
                break;
        }
    }

    updateProjectiles(otherTank){
        for(let q = this.projectiles.length - 1; q >= 0; q--){    
            
            // check against other projectiles
            for(let j = q; j >= 0; j--){
                if (this.projectiles[q] != this.projectiles[j]){
                    this.projectiles[q].resolveCollision(this.projectiles[j]);
                }
            }

            // check against planets and compute gravity
            for(let k of this.game.planets){
                this.projectiles[q].resolveCollision(k);
                this.projectiles[q].gravityForce(k);
            } 

            // check against moons and compute gravity
            for(let m of this.game.moons){
                this.projectiles[q].resolveCollision(m);
                this.projectiles[q].gravityForce(m);
            }

            // check against other tanks projectiles
            for(let l of otherTank.projectiles){
                if (this != otherTank){
                    this.projectiles[q].resolveCollision(l);
                }
            }  

            // check against tank and resolve hit
            for(let t of this.game.tanks){
                this.projectiles[q].resolveHit(t);
                if (this != t) {
                    this.projectiles[q].resolveCollision(t);
                }
            }  

            // Forces, behaviours and movement
            this.projectiles[q].wrap();            
            this.projectiles[q].airResistance();
            this.projectiles[q].move();               
            if(this.projectiles[q].life <= 0){
                this.projectiles[q].explode();
                this.projectiles.splice(q,1);
            } 
        }
    }

    showProjectiles(){
        for(let q = this.projectiles.length - 1; q >= 0; q--){
            this.projectiles[q].show(); 
        }
    }

    updateRuins(other){
        for(let q = this.ruins.length - 1; q >= 0; q--){       
            for(let j = q; j >= 0; j--){
                if (this.ruins[q] != this.ruins[j]){
                    this.ruins[q].resolveCollision(this.ruins[j]);
                }
            }
            for(let k of this.game.planets){
                this.ruins[q].resolveCollision(k);
                this.ruins[q].gravityForce(k);
            } 
            for(let l of other.projectiles){
                if (this != other){
                    this.ruins[q].resolveCollision(l);
                }
            }  
            for(let t of this.game.tanks){
                if (this != t) {
                    this.ruins[q].resolveCollision(t);
                }
            } 

            this.ruins[q].wrap();            
            this.ruins[q].airResistance();
            this.ruins[q].move();  
        }
    }

    showRuins(){
        for(let q = this.ruins.length - 1; q >= 0; q--){ 
            this.ruins[q].show();
        }
    }

    setPlayer(player){
        this.parentPlayer = player;
    }

    explode(){
        if (!this.exploded){
            for (let o = 0; o < 20; o++){
                let X = random(-10,10);
                let Y = random(-10,10);
                let vel = createVector(X*0.6,Y*0.6);
                let pos = createVector(this.pos.x + X, this.pos.y + Y);
                this.ruins.push(new Ruin(pos, vel, this));
            }
            this.game.explosions.push(new Explosion(this.pos, this.parentPlayer.color, 2, this.tankSize*100, 0, this.game));
            this.exploded = 1;
            console.log("Tank exploded");
        }
    }

    showTrajectory(){
        this.trajectory.splice(0, this.trajectory.length);        
        let shot = p5.Vector.fromAngle(radians(this.absoluteAngle), this.shotPower);
        let particle = new Projectile(this.barrelPos, shot, this);
        let showEvery = 8;
        let prevInvMass;

        for(let i = 0; i < showEvery*this.trajectoryLength; i++ ){

            for(let k of this.game.planets){
                prevInvMass = k.invMass;
                k.invMass = 0;
                particle.resolveCollision(k);
                particle.gravityForce(k);
                k.invMass = prevInvMass;
            }  
            
            for(let m of this.game.moons){
                prevInvMass = m.invMass;
                m.invMass = 0;
                particle.resolveCollision(m);
                particle.gravityForce(m);
                m.invMass = prevInvMass;
            } 
            
            particle.wrap();           
            particle.airResistance();
            particle.move();

            if (i % showEvery == 0){
                this.trajectory.push(particle.pos.copy());
            }
        }
        for(let t of this.trajectory){
            push();
            fill(particle.color);
            noStroke();
            ellipse(t.x, t.y, particle.rad * 1);
            pop()
        }
    }

}