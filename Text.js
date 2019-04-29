class Text {
    constructor(string, x, y, size = height * 0.11, color = "gray", radius = size * 0.06) {

        this.textSampleFactor = 8/size;
        if(this.textSampleFactor > 0.25) this.textSampleFactor = 0.25
        let tempBounds = font.textBounds(string, x, y, size);

        let tempDots = font.textToPoints(string, x - tempBounds.w / 2, y + tempBounds.h / 2, size, {
            sampleFactor: this.textSampleFactor,
            simplifyThreshold: 0
        });

        // Determine hitbox
        this.bounds = font.textBounds(string, x, y + tempBounds.h / 2, size);

        // Create particles
        this.dots = [];
        let spawnPos = createVector(x, y);
        for (let q of tempDots) {
            let pos = createVector(q.x, q.y);
            this.dots.push(new Dot(pos, radius, color, spawnPos));
        }

        // Save parameters
        this.string = string;
        this.x = x;
        this.y = y;
        this.pos = createVector(x, y);
        this.size = size;
        this.color = color;
        this.dotRadius = radius;
        

        // Others
        this.force = 200;
        this.maxSpeed = 20;
        this.minSpeed = .05;
        this.stayAwaydist = 0;
        this.forceDist = size / 4
        this.additiveDist = 0;
        this.interactive = 0;
        this.active = 0;
        this.clearingAnimation = 0;
        this.clickedFlag = 0;
    }

    show() {
        let previousDot = this.dots[0];

        noFill();
        // fill(this.color)
        // noStroke();
        stroke(this.color)
        strokeWeight(this.size/80);
        beginShape();
    
        for (let d of this.dots) {
            if(d.pos.dist(this.pos) > 5 || !this.clearingAnimation){
                d.show();
            }
            // if(d.target.dist(previousDot.target) < this.size/4 && d.pos.dist(previousDot.pos) < this.size/6){
            //     vertex(d.pos.x, d.pos.y);
            // }else{
            //     endShape(CLOSE);
            //     beginShape();
            // }
            // previousDot = d;
        }        

        endShape(CLOSE);

        // for (let d of this.dots) {
        //         if(d.pos.dist(this.pos) > 5 || !this.clearingAnimation){
        //             d.show();
        //         }              
        //     } 

        // ellipse(this.bounds.x, this.bounds.y, 5);
        // ellipse(this.bounds.x, this.bounds.y + this.bounds.h, 5);
        // ellipse(this.bounds.x + this.bounds.w, this.bounds.y, 5);
        // ellipse(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h, 5);
    }

    update() {
        this.stayAwaydist += this.additiveDist;
        if (this.interactive) {
            this.minSpeed = .03;            
        }else{
            this.minSpeed = 0;
        }
        if (this.active) this.minSpeed = .25;
        
        for (let d of this.dots) {
            d.move();
            //d.wrap();
            if(!this.clearingAnimation){

                d.seekTarget(this.force, this.maxSpeed, this.minSpeed);

                // if(!this.interactive) d.runFromTarget(this.force/5, this.forceDist, mouse);

                //if(this.inArea() && !this.interactive) d.seekTarget(this.force, this.maxSpeed, this.minSpeed, mouse);

                if(this.inArea() && this.interactive) d.seekTarget(this.force, this.maxSpeed, this.minSpeed, mouse);

                //d.stayAwayFromTarget(this.forceDist / 2, mouse);

                // for(let q of this.dots){                
                //     d.resolveCollision(q);
                // }
            }else{   
                this.additiveDist = 15;
                this.clickedFlag ? d.stayAwayFromTarget(this.stayAwaydist) : d.seekTarget(this.force, this.maxSpeed/2, 0, this.pos);
            }
        }
        //this.stayAwaydist = size/8;
    }

    changeText(newString) {
        let tempBounds = font.textBounds(newString, this.x, this.y, this.size);
        
        // Update hitbox
        this.bounds = font.textBounds(newString, this.x - tempBounds.w / 2, this.y + tempBounds.h / 2, this.size);

        let tempDots = font.textToPoints(newString, this.x - tempBounds.w / 2, this.y + tempBounds.h / 2, this.size, {
            sampleFactor: this.textSampleFactor,
            simplifyThreshold: 0
        });


        let diff = tempDots.length - this.dots.length;

        if(diff > 0){
            for(let i = 0; i < diff; i++){
                let pos = createVector(this.x, this.y);
                this.dots.push(new Dot(pos, this.dotRadius, this.color, pos));
            }
        }else{
            this.dots.splice(this.dots.length - (abs(diff)), abs(diff))
        }

        // Change targets of dots
        for (let i = 0; i < tempDots.length; i++) {
            let pos = createVector(tempDots[i].x, tempDots[i].y)
            this.dots[i].target = pos.copy();
        }
    }

    clicked() {
        if (this.inArea() && this.interactive) {
            for(let t of menu.texts){
                t.clickedFlag = 0;
            }
            this.clickedFlag = 1;
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
        //runFromMouse();
    }

    pressedFunction() {
        for (let d of this.dots) {
            d.runFromTarget(this.force * 5, this.forceDist * 2, mouse);
            d.stayAwayFromTarget(this.forceDist, mouse);
        }
    }
}

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
        this.position = createVector(x, y+50);
        this.size = 0;
        this.desiredPosition = createVector(x, y);
        this.desiredSize = this.baseSize;



        // Others
        this.force = 200;
        this.maxSpeed = 20;
        this.minSpeed = .05;
        this.forceDist = size / 4
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
        this.sizeVel = 0.1* (this.desiredSize - this.size);
        this.positionVel = p5.Vector.sub(this.desiredPosition, this.position);
        this.positionVel.mult(0.1);
        if(this.interactive){
            if(this.inArea()){
                this.desiredSize = this.baseSize * 0.9
                this.desiredPosition.x = this.basePosition.x + (mouseX - this.basePosition.x)/10;
                this.desiredPosition.y = this.basePosition.y + (mouseY - this.basePosition.y)/10;
            }else{
                this.desiredSize = this.baseSize;
                this.desiredPosition.x = this.basePosition.x
                this.desiredPosition.y = this.basePosition.y
            }
        }   

        this.position.add(this.positionVel);
        this.size += this.sizeVel;     
    }

    changeText(newString) {
    }

    clicked() {
        if (this.inArea() && this.interactive) {
            for(let t of menu.texts){
                t.clickedFlag = 0;
            }
            this.clickedFlag = 1;
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
        //runFromMouse();
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

    clickFunction() {
        if (this.cost <= this.player.money){
            switch (this.target) {
                case 1:
                    this.player.maxHp += this.value;
                    menu.texts[menu.texts.length - this.target - 1].changeText(this.player.maxHp + "");
                    break;

                case 2:
                    this.player.maxShotPower += this.value;
                    menu.texts[menu.texts.length - this.target - 1].changeText(this.player.maxShotPower + "");
                    break;

                case 3:
                    this.player.projectileDamage += this.value;
                    menu.texts[menu.texts.length - this.target - 1].changeText(this.player.projectileDamage + "");
                    break;

                case 4:
                    this.player.projectileExplosionRadius += this.value;
                    menu.texts[menu.texts.length - this.target - 1].changeText(round(this.player.projectileExplosionRadius) + "");
                    break;

                case 5:
                    this.player.projectileType = this.value;
                    if (this.active) this.player.money += this.cost;
                    for (let t of menu.texts) {
                        t.active = 0;
                    }
                    this.active = 1;
                    break;

                default:
                    break;
            }
            this.player.money -= this.cost;
        }        
        menu.texts[menu.texts.length - 1].changeText("Money: "+ this.player.money);
    }

}
