class Text {
    constructor(string, x, y, size = 20, color, diameter = size*0.08){
        this.dots = [];
        let tempDots = font.textToPoints(string, x-size*string.length*0.25, y + size*0.2, size);
        for(let q of tempDots){
            let pos = createVector(q.x, q.y)
            let vel = createVector(0, 0);
            this.dots.push(new Dot(pos, diameter, color));
        }
        this.down = y + size*0.2;
        this.up = this.down - size*0.7;
        this.left = this.dots[0].target.x;
        this.right = this.dots[this.dots.length-1].target.x;
        this.force = 500;
        this.dist = 20;
    }

    show(){
        for(let d of this.dots){
            d.show();
            // push();
            // fill(0);
            // ellipse(this.right, this.down, 5);
            // ellipse(this.right, this.up, 5);
            // ellipse(this.left, this.down, 5);
            // ellipse(this.left, this.up, 5);
            // pop();
        }
    }

    update(){
        for(let d of this.dots){
            d.move();
            //d.wrap();
            d.seekTarget();
            d.runFromTarget(mouse, this.force, this.dist);
            for(let q of this.dots){                
                d.resolveCollision(q);
            }
        }
    }

    clicked(){
        if(this.inArea()){
            this.clickFunction();
        }
    }

    inArea(){
        if(mouseX < this.left || mouseX > this.right) return false;
        if(mouseY < this.up || mouseY > this.down) return false;
        return true;
    }

    clickFunction(){
        runFromMouse();
    }
}

class Title extends Text {
    constructor(string, x, y, size, color, diameter) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
      }
      
      clickFunction(){
          runFromMouse();
          setTimeout(settingsMenu, 1000);
      }
    
}

class Mode extends Text {
    constructor(string, x, y, size, color, diameter, val) {
        super(string, x, y, size, color, diameter); // call the super class constructor and pass in the name parameter
        this.value = val;
    }
      
      clickFunction(){
          runFromMouse();
          setTimeout(createGameSesion, 500, this.value);
      }
    
}





