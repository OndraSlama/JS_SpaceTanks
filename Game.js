class Game{
    constructor(nop = 2){
        this.numberOfPlayers = nop;
        this.players = [];
        this.planets = [];
        this.tanks = [];
        this.players = [];
        this.finishedPlayers = [];
        this.explosions = [];
        this.roundsPlayed = 0;
        this.gameInProgress = false;
        this.maxScore = 3000;
        this.init();
    }

    init(){
        clearMenu();
        if(this.numberOfPlayers == 1){
            this.players.push(new Player('red', redPlayerControls));
            // players.push(new Player('blue', bluePlayerControld));
        }else if(this.numberOfPlayers == 2){
            this.players.push(new Player('red', redPlayerControls));
            this.players.push(new Player('black', bluePlayerControls));
        }
        this.createPlanets();
        this.createTanks();        
        console.log("Set up all properties");   
        this.gameInProgress = true;
    }

    play(){
        for(let i = this.planets.length - 1; i >= 0; i--){       
            this.planets[i].move();   
        }
    
        for(let t of this.tanks){
            if(t.hp > 0){
                t.control();
            }else{
                t.explode();
            }        
            for(let t2 of this.tanks){
                t.updateProjectiles(t2);
                t.updateRuins(t2);
            }
            
        }
    
        for(let i = this.explosions.length - 1; i >= 0; i--){            
            this.explosions[i].dealDamage(); 
            this.explosions[i].update();  
            if (this.explosions[i].alfa <= 0) this.explosions.splice(i, 1);
        }
    }

    show(){
        for(let i = this.planets.length - 1; i >= 0; i--){      
            this.planets[i].show();
        }
    
        for(let t of this.tanks){
            if(t.hp > 0){
                t.show();
                t.showProjectiles();                
            }    
            t.showRuins();        
        }
    
        for(let i = this.explosions.length - 1; i >= 0; i--){                 
            this.explosions[i].show();
        }
    }

    createPlanets() {
        let q = 0;
        let temp;
        let x = [0 + planetRadius * 2, width - planetRadius * 2];
        let y = [0 + planetRadius * 2, height - planetRadius * 2];
        let r = [planetRadius * 0.7, planetRadius * 1.3];

        this.planets.splice(0, this.planets.length);     

        this.planets.push(new Planet(random(x[0], x[1]), random(y[0], y[1]), random(r[0], r[1])));
        while (this.planets.length < 3) { // minimum of 3 planets        
            if (q-- < -20) break; // in case there are still less then 3 planets after X tries
            while (this.planets.length < maxPlanets && q < 100) { // will try to generate random planet until there are 6 of them or after 100 tries
                temp = new Planet(random(x[0], x[1]), random(y[0], y[1]), random(r[0], r[1]));
                if (temp.minDistanceToOthers(this.planets) > 3 * planetRadius) {
                    this.planets.push(temp);
                }
                q++;
            }
        }
    }

    createTanks(){    
        if (this.planets.length > 1){
            this.tanks.splice(0, this.tanks.length);
            for(let p of this.players){        
                let temp = new Tank(0, this.planets[this.tanks.length], this);   
                temp.setPlayer(p);
                p.setTank(temp);
                this.tanks.push(temp);
            }
        }
    }

    numberOfPlayersAlive(){
        let numberOfPlayersAlive = 0;
        for(let t of this.tanks){
            if(t.hp > 0) numberOfPlayersAlive++;
        }
        return numberOfPlayersAlive;
    }

    pushDeadPlayer(){
        for(let p of this.players){
            if(p.tank.hp <= 0){
                this.finishedPlayers.push(p);
            }
        }
    }

    pushAlivePlayer(){
        for(let p of this.players){
            if(p.tank.hp > 0){
                this.finishedPlayers.push(p);
            }
        }
    }

    giveScore(){
        let givenScore;
        for(let i = 0; i < this.finishedPlayers.length; i++){
           givenScore = map(i + 1, 1, this.finishedPlayers.length, this.maxScore/2, this.maxScore);
           this.finishedPlayers[i].score += givenScore;
        }
    }

    resolveGame(){
        this.pushDeadPlayer()
        if(this.numberOfPlayersAlive() <= 1 && this.gameInProgress == true){
            this.pushAlivePlayer()
            this.giveScore();
            this.roundsPlayed++;
            this.gameInProgress = false;
            let colorOfWinner = this.finishedPlayers[this.finishedPlayers.length - 1].color;
            setTimeout(this.newRoundMenu, 1000, colorOfWinner);
        }
    }

    newRoundMenu(colorOfWinner){
        texts.push(new Text("  Winner!", width/2, height*0.3, height*0.15, colorOfWinner));
        texts.push(new Text("New round?", width*0.5, height*0.6));
        texts.push(new Play("Yes", width*0.4, height*0.75, height*0.10));
        texts.push(new HomeMenu("No", width*0.6, height*0.75, height*0.10));
    
    }

    end(){
        for(let t of this.tanks){
            //if(t.projectiles) t.projecties.splice(0, t.projecties.length);
            if (t.ruins) t.ruins.splice(0, t.ruins.length);
        }
        this.tanks.splice(0, this.tanks.length);
        this.explosions.splice(0, this.explosions.length);
        this.planets.splice(0, this.planets.length);
        this.players.splice(0, this.players.length);
    }



}