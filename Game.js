class Game{
    constructor(nop){
        this.numOfPlayers = nop;
        this.players = [];
        this.planets = [];
        this.tanks = [];
        this.players = [];
        this.explosions = [];
    }

    play(){
        for(let i = this.planets.length - 1; i >= 0; i--){       
            this.planets[i].move();        
            this.planets[i].show();
        }
    
        for(let t of this.tanks){
            if(t.hp > 0){
                t.control();
                t.show();
            }else{
                t.explode();
                t.parentPlayer.score++;
            }        
            for(let t2 of this.tanks){
                t.updateProjectiles(t2);
            }
            
        }
    
        for(let i = this.explosions.length - 1; i >= 0; i--){
            for (let t of this.tanks){
                this.explosions[i].dealDamage(t);
            }
            this.explosions[i].show();
            if (this.explosions[i].alfa <= 0) this.explosions.splice(i, 1);
        }
    }

}