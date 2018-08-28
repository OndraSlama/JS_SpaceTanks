class Text {
    constructor(string, x, y, size = height * 0.11, color = "gray", radius = size * 0.05) {

        this.textSampleFactor = 6/size;
        if(this.textSampleFactor > 0.25) this.textSampleFactor = 0.25
        let tempBounds = font.textBounds(string, x, y, size);

        let tempDots = font.textToPoints(string, x - tempBounds.w / 2, y + tempBounds.h / 2, size, {
            sampleFactor: this.textSampleFactor,
            simplifyThreshold: 0
        });

        let bounds = font.textBounds(string, x, y + tempBounds.h / 2, size);

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

        // Determine hitbox
        this.left = bounds.x;
        this.right = bounds.x + bounds.w;
        this.down = bounds.y + bounds.h;
        this.up = bounds.y;

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
        stroke(this.color)
        strokeWeight(this.size/30);
        beginShape();
    
        for (let d of this.dots) {
            // if(d.pos.dist(this.pos) > 5 || !this.clearingAnimation){
            //     d.show();
            // }
            if(d.target.dist(previousDot.target) < this.size/3){
                vertex(d.pos.x, d.pos.y);
            }else{
                endShape(CLOSE);
                beginShape();
            }
            previousDot = d;
        }        

        endShape(CLOSE);

        // ellipse(this.right, this.down, 5);
        // ellipse(this.right, this.up, 5);
        // ellipse(this.left, this.down, 5);
        // ellipse(this.left, this.up, 5);
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

                if(!this.interactive) d.runFromTarget(this.force/5, this.forceDist, mouse);

                if(this.inArea() && this.interactive) d.seekTarget(this.force, this.maxSpeed, this.minSpeed, mouse);

                d.stayAwayFromTarget(this.forceDist / 4, mouse);
                // for(let q of this.dots){                
                //     d.resolveCollision(q);
                // }
            }else{   
                this.additiveDist = 15;
                this.clickedFlag ? d.stayAwayFromTarget(this.stayAwaydist, this.pos) : d.seekTarget(this.force, this.maxSpeed/2, 0, this.pos);
            }
        }
        //this.stayAwaydist = size/8;
    }

    changeText(newString) {
        let tempBounds = font.textBounds(newString, this.x, this.y, this.size);

        let tempDots = font.textToPoints(newString, this.x - tempBounds.w / 2, this.y + tempBounds.h / 2, this.size, {
            sampleFactor: this.textSampleFactor,
            simplifyThreshold: 0
        });

        let bounds = font.textBounds(newString, this.x - tempBounds.w / 2, this.y + tempBounds.h / 2, this.size);

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
        if (mouseX < this.left || mouseX > this.right) return false;
        if (mouseY < this.up || mouseY > this.down) return false;
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

// class Letter {
//     constructor(){
//         this.dots = [];
//     }

//     show(){

//     }
// }

class Play extends Text {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(createGameSesion, textAnimationSpeed, 2);
    }

}

class Mode extends Text {
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

class Settings extends Text {
    constructor(string, x, y, size, color, diameter, val) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.settingsMenu, textAnimationSpeed);
    }

}

class HomeMenu extends Text {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.homeMenu, textAnimationSpeed);
    }

}

class NewRound extends Text {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.interactive = 1;
    }

    clickFunction() {
        menu.clearAnimation();
        setTimeout(menu.roundCoutdown, textAnimationSpeed, menu.game);
    }

}

class NextPlayer extends Text {
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

class ShopItem extends Text {
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
