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
    texts.push(new Title('SpaceTanks', width/2, height/2, 100));


    // Buttons
    planetButton = createButton("Create Planets");    
    tankButton = createButton("Create Tanks");

    // Buttons callbacks
    planetButton.mouseClicked(createPlanets);
    tankButton.mouseClicked(createTanks);

    // Game settings
    redPlayerControls = [87, 83, 68, 65, 32];
    bluePlayerControld = [UP_ARROW , DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, SHIFT];


}

// Arrays
// let planets = [];
// let tanks = [];
// let players = [];
// let explosions = [];
let games = [];

// Parameters
let projectileRadius = 10;
let projectileMass = 10;
let planetRadius = canvasHeight/8;
let planetMass;
let maxPlanets = 10;

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

    for(let g of games){
        g.play();
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
    //         tanks[i].parentPlayer.score++;
    //     }        
    //     for(let j = tanks.length - 1; j >= 0; j--){
    //         tanks[i].updateProjectiles(tanks[j]);
    //     }
        
    // }

    // for(let i = explosions.length - 1; i >= 0; i--){
    //     for (let t of tanks){
    //         explosions[i].dealDamage(t);
    //     }
    //     explosions[i].show();
    //     if (explosions[i].alfa <= 0) explosions.splice(i, 1);
    // }

}