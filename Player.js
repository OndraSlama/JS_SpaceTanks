class Player{
    constructor(c, controls){
        this.color = c;
        this.tank;
        this.money = 0;
        this.score = 0;
        this.lives = 5;

        // Controls
        this.CW = controls[0];
        this.CCW = controls[1];
        this.LEFT = controls[2];
        this.RIGHT = controls[3];        
        this.SHOOT = controls[4]; 

        // Tank parameters
        this.maxHp = 100;
        this.maxShotPower = 10;
        this.tankSize = width*0.025;

         // Projectile parameters
         this.projectileDamage = 20;
         this.projectileExplosionRadius = width*0.025;
         this.projectileLife = 5;
         this.projectileRadius = width*0.025*0.15;
         this.projectileMass = 8;
         this.projectileType = 3;
    }

    setTank(tank){
        this.tank = tank;
    }
}