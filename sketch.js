// @ts-nocheck
let canvasHeight = 800;
let canvasWidth = 600;
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
    frameRate(300);
    textAlign(CENTER, CENTER);
    
    //Dynamic buttons
    homeMenu();
    // Game settings
    redPlayerControls = [87, 83, 68, 65, 32];
    bluePlayerControls = [UP_ARROW , DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, SHIFT];


}

// Arrays
let games = [];

// Parameters
let projectileRadius = 10;
let projectileMass = 10;
let planetRadius = canvasHeight/16;
let planetMass;
let maxPlanets = 10;
let gameSpeed = 3; // min == 1; max == 10 000x faster (-> 24 fps)

// Behaviors
let G = 0.03;
let bounceDamp = 0.9;
let impulseDamp = 0.5;
let airDamp = 0.05;


function draw() {
    
    mouse.set(mouseX, mouseY); 
    
    fill (255, 0, 0);

    if (texts.length > 0){
        background(150);
    }     

    for(let g of games){
        for(let f = 0; f < gameSpeed; f++){
            g.play();
            g.resolveGame();
        }        
        background(150);
        g.show();   
    }

    // Loop through texts      
    for(let t of texts){
        t.show();
        t.update();
    }   

    // for(let i = planets.length - 1; i >= 0; i--){       
    //     planets[i].move();        
    //     planets[i].show();
    // }

    // for(let i = tanks.length - 1; i >= 0; i--){
    //     if(tanks[i].hp > 0){
    //         tanks[i].control();
    //         tanks[i].show();
    //     }else{
    //         tanks[i].explode();
    //     }        
    //     for(let j = tanks.length - 1; j >= 0; j--){
    //         tanks[i].updateProjectiles(tanks[j]);
    //         tanks[i].updateRuins(tanks[j]);
    //     }        
    // }

    // for(let i = explosions.length - 1; i >= 0; i--){        
    //     explosions[i].dealDamage();       
    //     explosions[i].show();
    //     if (explosions[i].alfa <= 0) explosions.splice(i, 1);
    // }

}