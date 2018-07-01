class Player{
    constructor(c, controls){
        this.color = c;
        this.tank;
        this.money = 0;
        this.score = 0;
        this.CW = controls[0];
        this.CCW = controls[1];
        this.LEFT = controls[2];
        this.RIGHT = controls[3];        
        this.SHOOT = controls[4]; 
    }

    setTank(tank){
        this.tank = tank;
    }
}