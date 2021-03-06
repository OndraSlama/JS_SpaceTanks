// Global / p5 js specific variables
let canvasWidth;
let canvasHeight;
let backgroundColor;
let font;
let mouse;
let textAnimationSpeed = 1000;
let pressedKeys = []; // to store pressed keys

// Controls
let redPlayerControls = [];
let bluePlayerControld = [];

// Arrays
let games = [];
let texts = [];

// Menu
let menu;

// Parameters
let projectileRadius = 10;
let projectileMass = 10;
let planetRadius;
let planetMass;
let maxPlanets = 10;
let gameSpeed = 5; // min == 1; max == 10 000x faster (-> 24 fps)

// Behaviors
let G = 0.03;
let bounceDamp = 0.9;
let impulseDamp = 0.5;
let airDamp = 0.05;

// Debug
let noMenu = true;

function preload(){
    font = loadFont('segoeuil.ttf');
}

function setup() {

    // Create canvas
    canvasWidth = windowWidth * 0.7;
    canvasWidth = constrain(canvasWidth, 600, 1200);
    canvasHeight = canvasWidth * 3/5;
    
    canvas1 = createCanvas(canvasWidth, canvasHeight);
    canvas1.parent('sketch-holder');    

    // p5 settings
    angleMode(DEGREES);
    textFont(font);
    textAlign(CENTER);
    frameRate(60);
    
    // Game settings
    redPlayerControls = [87, 83, 68, 65, 70, 32]; // w s d a f space
    bluePlayerControls = [UP_ARROW , DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, SHIFT, 13];     // 13 = enter
    backgroundColor = color(0, 0, 20);
    planetRadius = height/8;

    // Others
    mouse = createVector(mouseX, mouseY);    
    createP("Game speed");
    gameSpeedSlider = createSlider(1, 10, 1, 1);
    
    //Dynamic menu
    menu = new Menu()
    if(!noMenu){
        menu.homeMenu();
    }else{
        createGameSesion();
    }
    
}

function draw() {
    
    mouse.set(mouseX, mouseY); 
    gameSpeed = gameSpeedSlider.value();
    
    fill (255, 0, 0); 

    if (menu.texts.length > 0){
        background(backgroundColor);
    } 

    // Show game
    for(let g of games){
        for(let f = 0; f < gameSpeed; f++){
            g.play();
            g.resolveGame();
        }        
        background(backgroundColor);
        g.show();   
    }

    // Show menu
    menu.show();

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