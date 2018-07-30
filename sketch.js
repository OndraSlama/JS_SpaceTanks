// @ts-nocheck
let canvasHeight = 600;
let canvasWidth = 400;
let redPlayerControls = [];
let bluePlayerControld = [];
let font;
let texts = [];
let mouse;

function preload(){
    font = loadFont('segoeuil.ttf');
}

function setup() {
    // Create canvas
    canvas1 = createCanvas(canvasHeight, canvasWidth);
    mouse = createVector(mouseX, mouseY);

    // p5 settings
    angleMode(DEGREES);
    frameRate(60);
    textAlign(CENTER, CENTER);
    
    //Dynamic button
    texts.push(new Title('SpaceTanks', width/2, height/2, canvasHeight*0.15));

    // Game settings
    redPlayerControls = [87, 83, 68, 65, 32];
    bluePlayerControls = [UP_ARROW , DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, SHIFT];


}

// Arrays
let planets = [];
let tanks = [];
let players = [];
let explosions = [];
let games = [];

// Parameters
let projectileRadius = 10;
let projectileMass = 10;
let planetRadius = canvasHeight/16;
let planetMass;
let maxPlanets = 10;

// Behaviors
let G = 0.03;
let bounceDamp = 0.9;
let impulseDamp = 0.5;
let airDamp = 0.05;


function draw() {
    background(150);
    mouse.set(mouseX, mouseY); 
    
    fill (255, 0, 0);

    // Loop through objects      
    for(let t of texts){
        t.show();
        t.update();
    }

    // for(let g of games){
    //     g.play();
    // }

    for(let i = planets.length - 1; i >= 0; i--){       
        planets[i].move();        
        planets[i].show();
    }

    for(let i = tanks.length - 1; i >= 0; i--){
        if(tanks[i].hp > 0){
            tanks[i].control();
            tanks[i].show();
        }else{
            tanks[i].explode();
        }        
        for(let j = tanks.length - 1; j >= 0; j--){
            tanks[i].updateProjectiles(tanks[j]);
            tanks[i].updateRuins(tanks[j]);
        }        
    }

    for(let i = explosions.length - 1; i >= 0; i--){        
        explosions[i].dealDamage();       
        explosions[i].show();
        explosions[i].disappear(i);
    }

}