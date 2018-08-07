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
        this.colorOfWinnerMenu = color("white");
        this.colorOfWinnerMenu._array[3] = 0;
        this.additiveAlpha = 0;
        this.alpha = 0;
        this.init();
    }

    init(){
        clearMenu();
        this.alpha = 0;

        if(this.numberOfPlayers == 1){
            this.players.push(new Player('red', redPlayerControls));
            // players.push(new Player('blue', bluePlayerControld));
        }else if(this.numberOfPlayers == 2){
            this.players.push(new Player('red', redPlayerControls));
            this.players.push(new Player('green', bluePlayerControls));
        }
        this.shopMenu();
        // this.createPlanets();
        // this.createTanks();        
        // console.log("Set up all properties");   
    }

    newRound(){
        this.createPlanets();
        this.createTanks();
        this.gameInProgress = true;
    }

    clearTanksAndPlanets(game = this){
        game.tanks.splice(0, game.tanks.length);
        game.planets.splice(0, game.planets.length);
        game.finishedPlayers.splice(0, game.finishedPlayers.length);
    }

    createPlanets() {
        let q = 0;
        let temp;
        let x = [0 + planetRadius * 1.5, width - planetRadius * 1.5];
        let y = [0 + planetRadius * 1.5, height - planetRadius * 1.5];
        let r = [planetRadius * 0.4, planetRadius * 1.2];

        this.planets.splice(0, this.planets.length);     

        this.planets.push(new Planet(random(x[0], x[1]), random(y[0], y[1]), random(r[0], r[1])));
        while (this.planets.length < 4) { // minimum of 4 planets        
            if (q-- < -10000) break; // in case there are still less then 3 planets after X tries
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
                let temp = new Tank(0, this.planets[this.tanks.length], p, this);   
                p.setTank(temp);
                this.tanks.push(temp);
            }
        }
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
             
        this.alpha += this.additiveAlpha;   
        if (this.alpha > 0.2)  this.alpha = 0.2;
        if (this.alpha < 0)  this.alpha = 0;

        this.colorOfWinnerMenu._array[3] = this.alpha;
        push();
        //this.colorOfWinnerMenu._array[3] = constrain(this.colorOfWinnerMenu._array[3], 0, 0.3);  
        //this.colorOfWinnerMenu._array[3] = 0.5;  
        noStroke();    
        // console.log(this.colorOfWinnerMenu._array[3]);
        fill(this.colorOfWinnerMenu);     
        rect(0, 0, width, height);
        pop()
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

    updatePlayerStatus(){
        let money;
        for(let i = 0; i < this.finishedPlayers.length; i++){
           money = map(i + 1, 1, this.finishedPlayers.length, this.maxScore/2, this.maxScore);
           this.finishedPlayers[i].money += money;
        }
    }

    resolveGame() {
        if (this.gameInProgress) {
            this.pushDeadPlayer()
            if (this.numberOfPlayersAlive() <= 1) {
                this.pushAlivePlayer()
                this.updatePlayerStatus();
                this.roundsPlayed++;
                this.gameInProgress = false;
                let colorOfWinner = this.finishedPlayers[this.finishedPlayers.length - 1].color;
                if (this.endOfGame()) {
                    setTimeout(this.endGameMenu, 1000, colorOfWinner, this);
                } else {
                    setTimeout(this.endRoundMenu, 1000, colorOfWinner, this);
                    setTimeout(clearAnimation, 5000);
                    setTimeout(clearMenu, 6000);
                    setTimeout(this.clearTanksAndPlanets, 6000, this);
                    setTimeout(this.shopMenu, 6000, this);

                }
            }
        }
    }

    endOfGame() {
        for (let p of this.players) {
            if (p.lives <= 0) return true;
        }
        return false;
    }

    endGameMenu(colorOfWinner, game) {
        texts.push(new Text("  Winner!", width / 2, height * 0.3, height * 0.15, colorOfWinner));
        texts.push(new Text("New game?", width * 0.5, height * 0.6));
        texts.push(new Play("Yes", width * 0.4, height * 0.75, height * 0.10));
        texts.push(new HomeMenu("No", width * 0.6, height * 0.75, height * 0.10));
        game.colorOfWinnerMenu = color(colorOfWinner);
        // game.colorOfWinnerMenu._array[3] = 0.5;
        game.additiveAlpha = 0.001;
    }

    endRoundMenu(colorOfWinner, game){
        texts.push(new Text("Winner!", width/2, height/2, height*0.20, colorOfWinner));   
        game.colorOfWinnerMenu = color(colorOfWinner);
        game.additiveAlpha = 0.003;     
    }

    shopMenu(game = this){
        game.additiveAlpha = -0.01;
        texts.push(new Text("Shop", width/2, height*0.1, height*0.15, "gold"));
        texts.push(new NewRound(game, "Play round", width/2, height*0.9, height*0.12));
        
        // Create interactive buttons
        // 1 = max Hp of tank
        // 2 = max shot power
        // 3 = projectile damage
        // 4 = explosion radius
        // 5 = projectile type
        fill(255);
        texts.push(new ShopItem(game.players[0], "^", width*0.1, height*0.3, height*0.15, undefined, undefined, 1, 10, 600));
        texts.push(new ShopItem(game.players[0], "^", width*0.1, height*0.4, height*0.15, undefined, undefined, 2, 1, 700)); 
        texts.push(new ShopItem(game.players[0], "^", width*0.1, height*0.5, height*0.15, undefined, undefined, 3, 5, 500)); 
        texts.push(new ShopItem(game.players[0], "^", width*0.1, height*0.6, height*0.15, undefined, undefined, 4, 3, 550)); 
        texts.push(new ShopItem(game.players[0], "Normal", width*0.25, height*0.7, height*0.11, undefined, undefined, 5, 1, 0)); 
        texts.push(new ShopItem(game.players[0], "Shatter", width*0.5, height*0.7, height*0.11, undefined, undefined, 5, 2, 2983)); 
        texts.push(new ShopItem(game.players[0], "Triple", width*0.75, height*0.7, height*0.11, undefined, undefined, 5, 3, 3333)); 
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