class Ruin extends Particle{
    
    constructor(pos, vel = createVector(0, 0), tank){
        super(pos, vel);
        this.rad = tank.tankSize*0.2;
        this.color = tank.parentPlayer.color;
        this.mass = this.rad;
        this.invMass = 1/this.mass;
        this.pathLength = 5;
    }
    resolveHit(){
        //  Nothing
    }
}