class Game{
    constructor(nop = 2){
        this.numberOfPlayers = nop;
        this.players = [];
        this.planets = [];
        this.moons = [];
        this.tanks = [];
        this.players = [];
        this.finishedPlayers = [];
        this.explosions = [];
        this.winner;

        this.roundsPlayed = 0;
        this.gameInProgress = false;
        this.maxScore = 3000;
        this.init();
    }

    init(){
        menu.setGame(this);

        if(this.numberOfPlayers == 1){
            this.players.push(new Player('red', redPlayerControls));
            // players.push(new Player('blue', bluePlayerControld));
        }else if(this.numberOfPlayers == 2){
            this.players.push(new Player('red', redPlayerControls));
            this.players.push(new Player('green', bluePlayerControls));
        }
        if(!noMenu){
            menu.shopMenu();
        }else{
            this.newRound();
        }
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
        game.moons.splice(0, game.moons.length);
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

        let p = this.planets[0];
        // x = p.pos.x;
        // y = p.pos.y + p.rad + 30;
        // let pos = createVector(x,y);
        this.moons.push(new Moon(p));
        // this.moons.push(new Projectile(pos, undefined, this.tanks[0]));
        // this.planets.push(new Planet(x, y, p.rad/4));
    }

    createTanks(){    
        if (this.planets.length > 1){
            this.tanks.splice(0, this.tanks.length);
            for(let p of this.players){
                let temp = new Tank(this.planets[this.tanks.length], p, this);   
                p.setTank(temp);
                this.tanks.push(temp);
            }
        }
    }

    play(){
        for(let p of this.planets){       
            p.move();   
        }

        for(let m of this.moons){       
            m.move();
            m.orbitPlanet();
            m.seekTarget(15);
            
            for(let p of this.planets){       
                m.resolveCollision(p);  
            }
        }
    
        for(let t of this.tanks){
            if(t.hp > 0){
                for(let p of this.planets){       
                    t.gravityForce(p);  
                    t.resolveCollision(p); 
                }

                for(let m of this.moons){       
                    t.gravityForce(m);  
                    t.resolveCollision(m); 
                }

                for(let t2 of this.tanks){    
                    if(t != t2)     
                    t.resolveCollision(t2); 
                }
                t.control();
                t.move();
                t.bounce();
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
            }    
            t.showProjectiles();
            t.showRuins();        
        }

        for (let m of this.moons){
            m.show();
        }
    
        for(let i = this.explosions.length - 1; i >= 0; i--){                 
            this.explosions[i].show();
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

    updatePlayerStatus(){
        let money;
        for(let i = 0; i < this.finishedPlayers.length; i++){
           money = map(i + 1, 1, this.finishedPlayers.length, this.maxScore/2, this.maxScore);
           this.finishedPlayers[i].money += money;
        }

        for(let i = 0; i < this.finishedPlayers.length - 1; i++){
            this.finishedPlayers[i].lives--;
         }
    }

    resolveGame() {
        if (this.gameInProgress) {
            this.pushDeadPlayer()
            if (this.numberOfPlayersAlive() <= 1) {
                this.pushAlivePlayer()
                this.updatePlayerStatus();
                this.roundsPlayed++;                
                this.winner = this.finishedPlayers[this.finishedPlayers.length - 1];
                if (this.endOfGame()) {
                    setTimeout(menu.endGameMenu, textAnimationSpeed);
                } else {
                    setTimeout(menu.endRoundMenu, textAnimationSpeed); 
                }
                this.gameInProgress = false;
            }
        }
    }

    endOfGame() {
        for (let p of this.players) {
            if (p.lives <= 0) return true;
        }
        return false;
    }

    // endGameMenu(colorOfWinner, game = this) {
    //     texts.push(new Text("  Winner!", width / 2, height * 0.3, height * 0.15, colorOfWinner));
    //     texts.push(new Text("New game?", width * 0.5, height * 0.6));
    //     texts.push(new Play("Yes", width * 0.4, height * 0.75, height * 0.10));
    //     texts.push(new HomeMenu("No", width * 0.6, height * 0.75, height * 0.10));
    //     game.colorOfWinnerMenu = color(colorOfWinner);
    //     // game.colorOfWinnerMenu._array[3] = 0.5;
    //     game.additiveAlpha = 0.001;
    // }

    // endRoundMenu(colorOfWinner, game = this){
    //     texts.push(new Text("Winner!", width/2, height/2, height*0.20, colorOfWinner));   
    //     game.colorOfWinnerMenu = color(colorOfWinner);
    //     game.additiveAlpha = 0.003;

    //     setTimeout(clearAnimation, textAnimationSpeed*4);
    //     // setTimeout(function(){
    //     //     game.clearTanksAndPlanets();
    //     //     game.shopMenu();
    //     // }, textAnimationSpeed*5);
    //     setTimeout(game.clearTanksAndPlanets, textAnimationSpeed*5, game);
    //     setTimeout(game.shopMenu, textAnimationSpeed*5, game);
        
    // }
    // shopMenu(game = this, index = 0){
    //     let moneyInfo = "Money: "+ game.players[index].money;
    //     let plr = game.players[index];
    //     let color = game.players[index].color;
    //     let col1 = width*0.33;
    //     let col2 = width*0.66;
    //     let row1 = height*0.3;
    //     let row2 = height*0.5
    //     game.additiveAlpha = -0.01;

    //     // texts.push(new Text("Player "+(index + 1), width*.5, height*0.06, height*0.11, color));
       
        
    //     // Create interactive buttons
    //     // 1 = max Hp of tank
    //     // 2 = max shot power
    //     // 3 = projectile damage
    //     // 4 = explosion radius
    //     // 5 = projectile type
    //     fill(255);
    //     texts.push(new Text("ARM",  col1 - width*0.08, row1, height*0.08, undefined));
    //     texts.push(new Text("PWR",  col1 - width*0.08, row2, height*0.08, undefined));
    //     texts.push(new Text("DMG",  col2 - width*0.08, row1, height*0.08, undefined));
    //     texts.push(new Text("RAD",  col2 - width*0.08, row2, height*0.08, undefined));
    //     // texts.push(new Text("Type", width*0.3, height*0.7, height*0.05, undefined));
    //     // texts.push(new ShopItem(plr, "^", width*0.1, height*0.4, height*0.15, undefined, undefined, 2, 1, 700)); 
    //     // texts.push(new ShopItem(plr, "^", width*0.1, height*0.5, height*0.15, undefined, undefined, 3, 5, 500)); 
    //     // texts.push(new ShopItem(plr, "^", width*0.1, height*0.6, height*0.15, undefined, undefined, 4, 3, 550));


    //     texts.push(new ShopItem(plr, "^",       col1,       row1 + height*0.05, height*0.15, color, undefined, 1, 15, 400));
    //     texts.push(new ShopItem(plr, "^",       col1,       row2 + height*0.05, height*0.15, color, undefined, 2, 1, 300)); 
    //     texts.push(new ShopItem(plr, "^",       col2,       row1 + height*0.05, height*0.15, color, undefined, 3, 5, 600)); 
    //     texts.push(new ShopItem(plr, "^",       col2,       row2 + height*0.05, height*0.15, color, undefined, 4, 3, 350)); 
    //     texts.push(new ShopItem(plr, "Normal",  width*0.24, height*0.7,         height*0.1, color, undefined, 5, 1, 0)); 
    //     texts.push(new ShopItem(plr, "Shatter", width*0.5,  height*0.7,         height*0.1, color, undefined, 5, 2, 2983)); 
    //     texts.push(new ShopItem(plr, "Triple",  width*0.75, height*0.7,         height*0.1, color, undefined, 5, 3, 3333));
        
    //     if (index < game.numberOfPlayers-1){
    //         texts.push(new NextPlayer(game, "Next player", width*0.5, height*0.85, height*0.12, undefined, undefined, index))
    //     }else{
    //         texts.push(new NewRound(game, "Play round", width*0.5, height*0.85, height*0.12))
    //     } 

    //     // Tank parameters
        
    //     texts.push(new Text(round(plr.projectileExplosionRadius) + "",  col2 + width*0.08, row2, height*0.08, undefined));
    //     texts.push(new Text(plr.projectileDamage + "",                  col2 + width*0.08, row1, height*0.08, undefined));
    //     texts.push(new Text(plr.maxShotPower + "",                      col1 + width*0.08, row2, height*0.08, undefined));
    //     texts.push(new Text(plr.maxHp + "",                             col1 + width*0.08, row1, height*0.08, undefined));
        

    //     // Money info - has to be last
    //     texts.push(new Text(moneyInfo, width*.48, height*0.1, height*0.15, color));
    // }

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