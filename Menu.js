class Menu {
    constructor(){
        this.texts = []; 
        this.game;
        this.color = color("black");
        this.desiredAlpha = 0; 
        this.aplhaChangeRate = 0.01;   

        this.currentAlpha = 0;
    }

    show(){               
        // Loop through texts      
        this.texts.forEach(t =>{
            t.show();
            t.update();
        });

        this.updateAlpha();
        push();        
        noStroke();       
        fill(this.color);     
        rect(0, 0, width, height);
        pop()
    }

    updateAlpha(){
        this.currentAlpha += sign(this.desiredAlpha - this.currentAlpha)*this.aplhaChangeRate;
        this.color = color(this.color);
        this.color._array[3] = this.currentAlpha;
    }

    setGame(game){
        this.game = game;
    }

    clearAnimation(alpa = 0){
        menu.texts.forEach(t => {
            t.clearingAnimation = 1;
        });
        menu.aplhaChangeRate = 0.01;
        menu.desiredAlpha = alpa;
        setTimeout(menu.clearMenu, textAnimationSpeed*0.9);
    }

    clearMenu(){
        menu.texts.forEach(t => {
            t.dots.splice(0, t.dots.length);
        });
        menu.texts.splice(0, menu.texts.length);;
    }

    roundCoutdown(){
        menu.texts.push(new Text("New Round in: 3", width/2, height/2, height*0.20));

        setTimeout(function() {
            menu.texts[menu.texts.length - 1].changeText("New Round in: 2");
        }, textAnimationSpeed);

        setTimeout(function() {
            menu.texts[menu.texts.length - 1].changeText("New Round in: 1");
        }, textAnimationSpeed * 2);

        setTimeout(function(){
            menu.clearAnimation();
            menu.game.newRound();
        }, textAnimationSpeed * 3);
    }

    homeMenu(){
        endGameSesions();
        menu.texts.push(new Text('SpaceTanks', width/2, height*0.2, height*0.2,"white"));    
        menu.texts.push(new Play("Quick play", width/2, height * 0.5))
        menu.texts.push(new Settings("Advanced Settings", width/2, height * 0.75))
    }

    settingsMenu(){    
        menu.texts.push(new Mode('1 Player', width*0.28, height*0.5, 70, "red", 3, 1));
        menu.texts.push(new Mode('2 Players', width*0.77, height*0.5, 70, "blue", 3, 2));
    }

    shopMenu(index = 0){
        let moneyInfo = "Money: "+ menu.game.players[index].money;
        let plr = menu.game.players[index];
        let color = menu.game.players[index].color;
        let col1 = width*0.33;
        let col2 = width*0.66;
        let row1 = height*0.3;
        let row2 = height*0.5;

        /*menu.color = plr.color;
        menu.desiredAlpha = 0.05;
        menu.aplhaChangeRate = 0.01;*/

        fill(0)
        textSize(30);
        text("ahoj");


        

        // texts.push(new Text("Player "+(index + 1), width*.5, height*0.06, height*0.11, color));
               
        // Create interactive buttons
        // 1 = max Hp of tank
        // 2 = max shot power
        // 3 = projectile damage
        // 4 = explosion radius
        // 5 = projectile type

        fill(255);
        menu.texts.push(new Text("ARM",  col1 - width*0.08, row1, height*0.08, undefined));
        menu.texts.push(new Text("PWR",  col1 - width*0.08, row2, height*0.08, undefined));
        menu.texts.push(new Text("DMG",  col2 - width*0.08, row1, height*0.08, undefined));
        menu.texts.push(new Text("RAD",  col2 - width*0.08, row2, height*0.08, undefined));
               
        menu.texts.push(new ShopItem(plr, "^",       col1,       row1 + height*0.05, height*0.15, color, undefined, 1, 15, 400));
        menu.texts.push(new ShopItem(plr, "^",       col1,       row2 + height*0.05, height*0.15, color, undefined, 2, 1, 300)); 
        menu.texts.push(new ShopItem(plr, "^",       col2,       row1 + height*0.05, height*0.15, color, undefined, 3, 5, 600)); 
        menu.texts.push(new ShopItem(plr, "^",       col2,       row2 + height*0.05, height*0.15, color, undefined, 4, 3, 350)); 
        menu.texts.push(new ShopItem(plr, "Normal",  width*0.24, height*0.7,         height*0.1, color, undefined, 5, 1, 0)); 
        menu.texts.push(new ShopItem(plr, "Shatter", width*0.5,  height*0.7,         height*0.1, color, undefined, 5, 2, 2983)); 
        menu.texts.push(new ShopItem(plr, "Triple",  width*0.75, height*0.7,         height*0.1, color, undefined, 5, 3, 3333));
        
        if (index < menu.game.numberOfPlayers-1){
            menu.texts.push(new NextPlayer("Next player", width*0.5, height*0.85, height*0.12, undefined, undefined, index))
        }else{
            menu.texts.push(new NewRound("Play round", width*0.5, height*0.85, height*0.12))
        } 

        // Tank parameters        
        menu.texts.push(new Text(round(plr.projectileExplosionRadius) + "",  col2 + width*0.08, row2, height*0.08, undefined));
        menu.texts.push(new Text(plr.projectileDamage + "",                  col2 + width*0.08, row1, height*0.08, undefined));
        menu.texts.push(new Text(plr.maxShotPower + "",                      col1 + width*0.08, row2, height*0.08, undefined));
        menu.texts.push(new Text(plr.maxHp + "",                             col1 + width*0.08, row1, height*0.08, undefined));
        
        // Money info - has to be last
        menu.texts.push(new Text(moneyInfo, width*.48, height*0.1, height*0.15, color));
    }

    endRoundMenu(){        
        let colorOfWinner = menu.game.winner.color;
        menu.texts.push(new Text("Winner!", width/2, height/2, height*0.20, colorOfWinner));   
        menu.color = color(colorOfWinner);
        menu.aplhaChangeRate = 0.003;
        menu.desiredAlpha = 0.2;

        setTimeout(menu.clearAnimation, textAnimationSpeed*4);        
        setTimeout(menu.game.clearTanksAndPlanets, textAnimationSpeed*5, menu.game);
        setTimeout(menu.shopMenu, textAnimationSpeed*5);
        
    }

    endGameMenu() {       
        let colorOfWinner = menu.game.colorOfWinner;
        menu.texts.push(new Text("Winner of game!", width / 2, height * 0.3, height * 0.15, colorOfWinner));
        menu.texts.push(new Text("New game?", width * 0.5, height * 0.6));
        menu.texts.push(new Play("Yes", width * 0.4, height * 0.75, height * 0.10));
        menu.texts.push(new HomeMenu("No", width * 0.6, height * 0.75, height * 0.10));
        menu.color = color(colorOfWinner);
        menu.aplhaChangeRate = 0.0015;
        menu.desiredAlpha = 0.3;
    }
}