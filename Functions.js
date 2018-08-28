function createGameSesion(numberOfPlayers){    
    games.push(new Game(numberOfPlayers));    
    console.log("Created game sesion");
}

function settingsMenu(){    
    texts.push(new Mode('1 Player', width*0.28, height*0.5, 70, "red", 3, 1));
    texts.push(new Mode('2 Players', width*0.77, height*0.5, 70, "blue", 3, 2));
}

// function goHome(){
//     endGameSesions();

    // texts.push(new Text('SpaceTanks', width/2, height*0.2, height*0.2,"white"));

    // texts.push(new Play("Quick play", width/2, height * 0.5))
    // texts.push(new Settings("Advanced Settings", width/2, height * 0.75))
// }

// function playNewRound(game){
    // texts.push(new Text("New Round in: 3", width/2, height/2, height*0.20));
    // setTimeout(function() {
    //     texts[texts.length - 1].changeText("New Round in: 2");
    // }, textAnimationSpeed);
    // setTimeout(function() {
    //     texts[texts.length - 1].changeText("New Round in: 1");
    // }, textAnimationSpeed * 2);
    // setTimeout(function(){
    //     clearAnimation();
    //     game.newRound();
    // }, textAnimationSpeed * 3);    
    
// }

// function clearMenu(){
//     texts.forEach(t => {
//         t.dots.splice(0, t.dots.length);
//     });
//     texts.splice(0, texts.length);
// }

function endGameSesions(){
    games.forEach(g => {
        g.end();
    })
    games.splice(0, games.length);
}

// function clearAnimation(){
//     for (let t of texts){
//         // t.force = 400;
//         t.clearingAnimation = 1;
//     }
//     setTimeout(clearMenu, textAnimationSpeed*0.9);
// }

function mouseDragged(){
    menu.texts.forEach(t => {
        t.pressed();
    })
}

function mousePressed(){
    menu.texts.forEach(t => {
        t.pressed();
    })
}

function mouseClicked(){    
    menu.texts.forEach(t => {
        t.clicked();
    })
}

function windowResized(){
    canvasWidth = windowWidth * 0.7;
    canvas1.width = constrain(canvasWidth, 600, 1200);
    canvas1.height = canvasWidth * 3/5;
}

onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    pressedKeys[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
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