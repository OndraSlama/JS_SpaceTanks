class Text {
    constructor(string, x, y, size = height * 0.11, color = "white", radius = size*0.04){
        this.dots = [];
        let tempDots = font.textToPoints(string, x-size*string.length*0.25, y + size*0.2, size, {
            sampleFactor: .15,
            simplifyThreshold: 0
          });

        // Create particles
        for(let q of tempDots){
            let pos = createVector(q.x, q.y)
            let vel = createVector(0, 0);
            this.dots.push(new Dot(pos, radius, color));
        }

        // Determine hitbox
        this.left = this.dots[0].target.x;
        this.right = this.dots[this.dots.length-1].target.x;
        this.down = y + size*0.2;
        this.up = this.down - size*0.7;        
        for(let q of tempDots){
            if(q.x < this.left) this.left = q.x;
            if(q.x > this.right) this.right = q.x;
        }

        this.force = 200;
        this.maxSpeed = 7;
        this.minSpeed = .1;
        this.stayAwaydist = size/8;
        this.additiveDist = 0;
    }

    show(){
        for(let d of this.dots){
            d.show();
            // push();
            // fill(0);
            //  ellipse(this.right, this.down, 5);
            //  ellipse(this.right, this.up, 5);
            //  ellipse(this.left, this.down, 5);
            //  ellipse(this.left, this.up, 5);
            // pop();
        }
    }

    update(){
        this.stayAwaydist += this.additiveDist;
        this.inArea() ? this.minSpeed = .6 : this.minSpeed = .1;
        for(let d of this.dots){
            d.move();
            //d.wrap();
            d.seekTarget(this.force, this.maxSpeed, this.minSpeed);
            d.runFromTarget(this.force, this.stayAwaydist*2, mouse);
            d.stayAwayFromTarget(this.stayAwaydist, mouse);            
            // for(let q of this.dots){                
            //     d.resolveCollision(q);
            // }
        }
        //this.stayAwaydist = size/8;
    }

    clicked(){
        if(this.inArea()){
            this.clickFunction();
        }
    }

    pressed(){
        if(this.inArea()){
            this.pressedFunction();
        }
    }

    inArea(){
        if(mouseX < this.left || mouseX > this.right) return false;
        if(mouseY < this.up || mouseY > this.down) return false;
        return true;
    }

    clickFunction(){
        //runFromMouse();
    }

    pressedFunction(){
        for(let d of this.dots){            
            d.runFromTarget(this.force*2, this.stayAwaydist*4, mouse);
            d.stayAwayFromTarget(this.stayAwaydist*2, mouse);
        }
    }
}

class Play extends Text {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
      }
      
      clickFunction(){
          runFromMouse();          
          setTimeout(createGameSesion, 1000, 2);
      }
    
}

class Mode extends Text {
    constructor(string, x, y, size, color, diameter, val) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.value = val;
    }
      
      clickFunction(){
          runFromMouse();
          setTimeout(createGameSesion, 1000, this.value);
      }
    
}

class Settings extends Text {
    constructor(string, x, y, size, color, diameter, val) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
    }
      
      clickFunction(){
          runFromMouse();
          setTimeout(settingsMenu, 1000);
      }
    
}

class HomeMenu extends Text {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
      }
      
      clickFunction(){
          runFromMouse();          
          setTimeout(homeMenu, 1000);
      }
    
}





