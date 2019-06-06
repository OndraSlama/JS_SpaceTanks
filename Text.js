// class Text {
//     constructor(string, x, y, size = height * 0.11, color = "gray", radius = size * 0.06) {

//         this.textSampleFactor = 8/size;
//         if(this.textSampleFactor > 0.25) this.textSampleFactor = 0.25
//         let tempBounds = font.textBounds(string, x, y, size);

//         let tempDots = font.textToPoints(string, x - tempBounds.w / 2, y + tempBounds.h / 2, size, {
//             sampleFactor: this.textSampleFactor,
//             simplifyThreshold: 0
//         });

//         // Determine hitbox
//         this.bounds = font.textBounds(string, x, y + tempBounds.h / 2, size);

//         // Create particles
//         this.dots = [];
//         let spawnPos = createVector(x, y);
//         for (let q of tempDots) {
//             let pos = createVector(q.x, q.y);
//             this.dots.push(new Dot(pos, radius, color, spawnPos));
//         }

//         // Save parameters
//         this.string = string;
//         this.x = x;
//         this.y = y;
//         this.pos = createVector(x, y);
//         this.size = size;
//         this.color = color;
//         this.dotRadius = radius;
        

//         // Others
//         this.force = 200;
//         this.maxSpeed = 20;
//         this.minSpeed = .05;
//         this.stayAwaydist = 0;
//         this.forceDist = size / 4
//         this.additiveDist = 0;
//         this.interactive = 0;
//         this.active = 0;
//         this.clearingAnimation = 0;
//         this.clickedFlag = 0;
//     }

//     show() {
//         let previousDot = this.dots[0];

//         noFill();
//         // fill(this.color)
//         // noStroke();
//         stroke(this.color)
//         strokeWeight(this.size/80);
//         beginShape();
    
//         for (let d of this.dots) {
//             if(d.pos.dist(this.pos) > 5 || !this.clearingAnimation){
//                 d.show();
//             }
//             // if(d.target.dist(previousDot.target) < this.size/4 && d.pos.dist(previousDot.pos) < this.size/6){
//             //     vertex(d.pos.x, d.pos.y);
//             // }else{
//             //     endShape(CLOSE);
//             //     beginShape();
//             // }
//             // previousDot = d;
//         }        

//         endShape(CLOSE);

//         // for (let d of this.dots) {
//         //         if(d.pos.dist(this.pos) > 5 || !this.clearingAnimation){
//         //             d.show();
//         //         }              
//         //     } 

//         // ellipse(this.bounds.x, this.bounds.y, 5);
//         // ellipse(this.bounds.x, this.bounds.y + this.bounds.h, 5);
//         // ellipse(this.bounds.x + this.bounds.w, this.bounds.y, 5);
//         // ellipse(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h, 5);
//     }

//     update() {
//         this.stayAwaydist += this.additiveDist;
//         if (this.interactive) {
//             this.minSpeed = .03;            
//         }else{
//             this.minSpeed = 0;
//         }
//         if (this.active) this.minSpeed = .25;
        
//         for (let d of this.dots) {
//             d.move();
//             //d.wrap();
//             if(!this.clearingAnimation){

//                 d.seekTarget(this.force, this.maxSpeed, this.minSpeed);

//                 // if(!this.interactive) d.runFromTarget(this.force/5, this.forceDist, mouse);

//                 //if(this.inArea() && !this.interactive) d.seekTarget(this.force, this.maxSpeed, this.minSpeed, mouse);

//                 if(this.inArea() && this.interactive) d.seekTarget(this.force, this.maxSpeed, this.minSpeed, mouse);

//                 //d.stayAwayFromTarget(this.forceDist / 2, mouse);

//                 // for(let q of this.dots){                
//                 //     d.resolveCollision(q);
//                 // }
//             }else{   
//                 this.additiveDist = 15;
//                 this.clickedFlag ? d.stayAwayFromTarget(this.stayAwaydist) : d.seekTarget(this.force, this.maxSpeed/2, 0, this.pos);
//             }
//         }
//         //this.stayAwaydist = size/8;
//     }

//     changeText(newString) {
//         let tempBounds = font.textBounds(newString, this.x, this.y, this.size);
        
//         // Update hitbox
//         this.bounds = font.textBounds(newString, this.x - tempBounds.w / 2, this.y + tempBounds.h / 2, this.size);

//         let tempDots = font.textToPoints(newString, this.x - tempBounds.w / 2, this.y + tempBounds.h / 2, this.size, {
//             sampleFactor: this.textSampleFactor,
//             simplifyThreshold: 0
//         });


//         let diff = tempDots.length - this.dots.length;

//         if(diff > 0){
//             for(let i = 0; i < diff; i++){
//                 let pos = createVector(this.x, this.y);
//                 this.dots.push(new Dot(pos, this.dotRadius, this.color, pos));
//             }
//         }else{
//             this.dots.splice(this.dots.length - (abs(diff)), abs(diff))
//         }

//         // Change targets of dots
//         for (let i = 0; i < tempDots.length; i++) {
//             let pos = createVector(tempDots[i].x, tempDots[i].y)
//             this.dots[i].target = pos.copy();
//         }
//     }

//     clicked() {
//         if (this.inArea() && this.interactive) {
//             for(let t of menu.texts){
//                 t.clickedFlag = 0;
//             }
//             this.clickedFlag = 1;
//             this.clickFunction();
//         }
//     }

//     pressed() {
//         if (this.inArea()) {
//             this.pressedFunction();
//         }
//     }

//     inArea() {
//         if (mouseX < this.bounds.x || mouseX > this.bounds.x + this.bounds.w) return false;
//         if (mouseY < this.bounds.y || mouseY > this.bounds.y + this.bounds.h) return false;
//         return true;
//     }

//     clickFunction() {
//         //runFromMouse();
//     }

//     pressedFunction() {
//         for (let d of this.dots) {
//             d.runFromTarget(this.force * 5, this.forceDist * 2, mouse);
//             d.stayAwayFromTarget(this.forceDist, mouse);
//         }
//     }
// }

class NewText {
    constructor(string, x, y, size = height * 0.11, color = "gray") { 

        textAlign(CENTER, CENTER);

        // Determine hitbox
        this.bounds = font.textBounds(string, x, y + size*0.4, size);

        // Save parameters
        this.string = string;
        this.horizontalAlign = CENTER;
        this.verticalAlign = CENTER;
        this.color = color;    
        this.baseSize = size;
        this.basePosition = createVector(x, y);

        //State properties
        this.positionVel = createVector();
        this.sizeVel = 0;
        // this.positionAcc = createVector();
        // this.sizeAcc = 0;
        this.position = createVector(x, y);
        this.size = 0*this.baseSize;
        this.desiredPosition = createVector(x, y);
        this.desiredSize = this.baseSize;



        // Others
        this.positionSpeedFactor = 20;
        this.sizeSpeedFactor = 30;
        this.positionDragFactor = .6;
        this.sizeDragFactor = .8;
        this.positionMass = 1000;
        this.sizeMass = 800;
        this.interactive = 0;
        this.active = 0;
        this.clickedFlag = 0;
    }

    show() {
        fill(this.color);
        textFont(font);
        textSize(this.size);
        textAlign(this.horizontalAlign, this.verticalAlign);
        text(this.string, this.position.x, this.position.y);

        // ellipse(this.position.x, this.position.y, 5);

        // ellipse(this.bounds.x, this.bounds.y, 5);
        // ellipse(this.bounds.x, this.bounds.y + this.bounds.h, 5);
        // ellipse(this.bounds.x + this.bounds.w, this.bounds.y, 5);
        // ellipse(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h, 5);
    }

    update() {
        if(this.interactive){
            if(this.inArea()){
                this.desiredSize = this.baseSize * 1.1
                this.desiredPosition.x = this.basePosition.x + (mouseX - this.basePosition.x)/10;
                this.desiredPosition.y = this.basePosition.y + (mouseY - this.basePosition.y)/10;
            }else{
                this.desiredSize = this.baseSize;
                this.desiredPosition.x = this.basePosition.x
                this.desiredPosition.y = this.basePosition.y
            }
        }   

        let sizeForce = this.sizeSpeedFactor* (this.desiredSize - this.size);
        let positionForce = p5.Vector.sub(this.desiredPosition, this.position);
        positionForce.mult(this.positionSpeedFactor);

        this.positionVel.add(p5.Vector.mult(positionForce, 1 / this.positionMass))
        this.sizeVel += sizeForce / this.sizeMass;
        this.positionVel.mult(this.positionDragFactor);
        this.sizeVel *= this.sizeDragFactor;
        this.position.add(this.positionVel);
        this.size += this.sizeVel;
    }

    changeText(newString) {
        this.string = newString;
    }

    clicked() {
        if (this.inArea() && this.interactive) {
            for(let t of menu.texts){
                t.clickedFlag = 0;
            }
            this.clickedFlag = 1;
            let sizeForce = -4000
            this.sizeVel += sizeForce / this.sizeMass;

            this.clickFunction();
        }
    }

    pressed() {
        if (this.inArea()) {
            this.pressedFunction();
        }
    }

    inArea() {
        if (mouseX < this.bounds.x || mouseX > this.bounds.x + this.bounds.w) return false;
        if (mouseY < this.bounds.y || mouseY > this.bounds.y + this.bounds.h) return false;
        return true;
    }

    clickFunction() {
    }

    pressedFunction() {  
    }
}


// class Letter {
//     constructor(){
//         this.dots = [];
//     }

//     show(){

//     }
// }

class Play extends NewText {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(createGameSesion, textAnimationSpeed, 2);
    }

}

class Mode extends NewText {
    constructor(string, x, y, size, color, diameter, val) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.value = val;
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(createGameSesion, textAnimationSpeed, this.value);
    }

}

class Settings extends NewText {
    constructor(string, x, y, size, color, diameter, val) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.settingsMenu, textAnimationSpeed);
    }

}

class HomeMenu extends NewText {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.homeMenu, textAnimationSpeed);
    }

}

class NewRound extends NewText {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.roundCoutdown, textAnimationSpeed, menu.game);
    }

}

class NextPlayer extends NewText {
    constructor(string, x, y, size, color, diameter, value) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.value = value;
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.shopMenu, textAnimationSpeed, this.value + 1);
    }
}

class ShopItem extends NewText {
    constructor(player, string, x, y, size, color, diameter, target, val, cost) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.player = player;
        this.value = val;
        this.target = target;
        this.cost = cost;
        this.interactive = 1;
        if(val == player.projectileType && target == 5){
            this.active = 1;
        }
    }

    show() {
        let currentColor = this.color
        
        let found = false;

        if(this.cost <= this.player.money){
            currentColor = "white"
        }else{
            currentColor = "gray"
        }

        for(let p of this.player.ownedProjectiles){
            if(p == this.value) found = true;
        }
        if(found){
            if(!this.active && this.target == 5){
                currentColor = color(this.color);
                currentColor._array[3] = 0.5;  
            }  
            if(this.active) currentColor = color(this.color); 
        }

        if(this.inArea()){
            menu.moneyInfo = "Money: "+ this.player.money + " - " + this.cost;
        }

        fill(currentColor);
        textFont(font);
        textSize(this.size);
        textAlign(this.horizontalAlign, this.verticalAlign);
        text(this.string, this.position.x, this.position.y);

        // ellipse(this.position.x, this.position.y, 5);

        // ellipse(this.bounds.x, this.bounds.y, 5);
        // ellipse(this.bounds.x, this.bounds.y + this.bounds.h, 5);
        // ellipse(this.bounds.x + this.bounds.w, this.bounds.y, 5);
        // ellipse(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h, 5);
    }

    clickFunction() {
        
            switch (this.target) {
                case 1:
                    if (this.cost <= this.player.money){
                        this.player.maxHp += this.value;
                        menu.texts[menu.texts.length - this.target - 1].changeText(this.player.maxHp + "");
                        this.player.money -= this.cost;
                    }
                    break;

                case 2:
                    if (this.cost <= this.player.money){
                        this.player.maxShotPower += this.value;
                        menu.texts[menu.texts.length - this.target - 1].changeText(this.player.maxShotPower + "");
                        this.player.money -= this.cost;
                    }
                    break;

                case 3:
                    if (this.cost <= this.player.money){
                        this.player.projectileDamage += this.value;
                        menu.texts[menu.texts.length - this.target - 1].changeText(this.player.projectileDamage + "");
                        this.player.money -= this.cost;
                    }
                    break;

                case 4:
                    if (this.cost <= this.player.money){
                        this.player.projectileExplosionRadius += this.value;
                        menu.texts[menu.texts.length - this.target - 1].changeText(round(this.player.projectileExplosionRadius) + "");
                        this.player.money -= this.cost;
                    }
                    break;

                case 5:
                    let found = false;
                    for(let p of this.player.ownedProjectiles){
                        if(p == this.value) found = true;
                    }

                    if (this.cost <= this.player.money && !found){
                        this.player.projectileType = this.value;                        

                        this.player.ownedProjectiles.push(this.value)    
                        this.player.money -= this.cost;

                        for (let t of menu.texts) {
                            t.active = 0;
                        }
                        this.active = 1; 
                    }else if(found){
                        this.player.projectileType = this.value;
                        for (let t of menu.texts) {
                            t.active = 0;
                        }
                        this.active = 1;
                    }
                    break;

                default:
                    break;
            }           
        menu.texts[menu.texts.length - 1].changeText("Money: "+ this.player.money);
    }
}
