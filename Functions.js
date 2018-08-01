function createGameSesion(numberOfPlayers){    
    games.push(new Game(numberOfPlayers));
    console.log("Created game sesion");
}

function settingsMenu(){    
    clearMenu();
    texts.push(new Mode('1 Player', width*0.28, height*0.5, 70, "red", 3, 1));
    texts.push(new Mode('2 Players', width*0.77, height*0.5, 70, "blue", 3, 2));
}

function homeMenu(){
    clearMenu();
    endGameSesions();
    texts.push(new Text('SpaceTanks', width/2, height*0.2, canvasHeight*0.15));

    texts.push(new Play("Quck play", width/2, height * 0.5))
    texts.push(new Settings("Advanced Settings", width/2, height * 0.75))
}

function clearMenu(){
    for (let t of texts){
        t.dots.splice(0, t.dots.length);
    }
    texts.splice(0, text.length);
}

function endGameSesions(){
    for(let g of games){
        g.end();
    }
    games.splice(0, games.length);
}

function runFromMouse(){
    for (let t of texts){
        // t.force = 400;
        t.additiveDist = 20;
    }
}

function mouseDragged(){
    for(let t of texts){
        t.pressed();
    }
}

function mousePressed(){
    for(let t of texts){
        t.pressed();
    }
}

function mouseClicked(){    
    for(let t of texts){
        t.clicked();
    }
}

function createPlanets(){
    let q = 0;
    let temp;
    let x = [0 + planetRadius * 2, width - planetRadius * 2];
    let y = [0 + planetRadius * 2, height - planetRadius * 2];
    let r = [planetRadius*0.7, planetRadius*1.3];

    planets.splice(0, planets.length);  
    
    let a = new Planet(random(x[0], x[1]), random(y[0], y[1]), random(r[0], r[1]));
    
    planets.push(new Planet(random(x[0], x[1]), random(y[0], y[1]), random(r[0], r[1])));        
    while(planets.length < 3){ // minimum of 3 planets        
        if (q-- < -20) break; // in case there are still less then 3 planets after X tries
        while (planets.length < maxPlanets && q < 100){ // will try to generate random planet until there are 6 of them or after 100 tries
            temp = new Planet(random(x[0], x[1]), random(y[0], y[1]), random(r[0], r[1]));            
            if(temp.minDistanceToOthers(planets) > 3 * planetRadius){
                planets.push(temp);
            }            
            q++;            
        }
    }
}

function createTanks(){    
    if (planets.length > 1){
        tanks.splice(0, tanks.length);
        for(p of players){        
            let temp = new Tank(0, planets[tanks.length]);   
            temp.setPlayer(p);
            p.setTank(temp);
            tanks.push(temp);
        }
    }
}


// function mouseDragged(){   
//     if (mouseX < width && mouseY < height){ 
//         if(projectiles.length < 500) createBall(mouseX, mouseY, projectileRadius, projectileMass);
//     }
// }


function sign(arg){
    if(arg > 0){
        return 1;
    }else if(arg < 0){
        return -1;
    }else{
        return 0;
    }
}