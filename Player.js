class Player{
    constructor(c, controls){
        this.color = c;
        this.tank;
        this.money = 3000;
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
        this.tankSize = height*0.03;

         // Projectile parameters
         this.projectileDamage = 20;
         this.projectileExplosionRadius = height*0.03;
         this.projectileLife = 5;
         this.projectileRadius = height*0.03*0.15;
         this.projectileMass = 8;
         this.projectileType = 2;
    }

    setTank(tank){
        this.tank = tank;
    }
}