class Layer {
    constructor() {
        this.sides = SIDES
        this.numShapes = this.sides
        this.angle = 360 / this.numShapes
        this.stepsOut = 8
        this.alpha = 255;
        this.singleStep = (CRYSTAL_SIZE / 2) / this.stepsOut
        this.thinStroke = 1
        this.thickStroke = 3
        this.rotateAll = 0;
        this.layerColor = getRandomFromPalette()
    }
}

class Circles extends Layer {
    constructor() {
        super()
        this.shapeSize = (CRYSTAL_SIZE / 2) * 0.93
        this.position = (CRYSTAL_SIZE / 2) - (this.shapeSize / 2)
    }

    render() {
        noFill()
        stroke(this.layerColor, this.alpha)
        strokeWeight(1)
        push()
            //translate(width/2, height/2)
        for (let i = 0; i <= this.numShapes; i++) {
            ellipse(this.position, 0, this.shapeSize, this.shapeSize)
            rotate(this.angle)
        }
        rotate(this.rotateAll);
        pop()
    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}

class SimpleLines extends Layer {
    constructor() {
        super()
        this.numSteps = randomSelectTwo() ? this.stepsOut : int(this.stepsOut * 1.25)
        this.step = (CRYSTAL_SIZE / 2) / this.numSteps
        this.start = floor(random(0, this.numSteps))
        this.stop = floor(random(this.start, this.numSteps + 1))
        this.weight = randomSelectTwo() ? this.thinStroke : this.thickStroke
        this.numShapes = randomSelectTwo() ? this.sides : this.sides * 2
        this.angle = 360 / this.numShapes
        this.alpha = 255;
        this.rotateAll = 0
    }

    render() {
        noFill()
        stroke(this.layerColor, this.alpha)
        strokeWeight(this.weight)
        push()
            //translate(width/2, height/2)
        for (let i = 0; i < this.numShapes; i++) {
            line(this.start * this.step, 0, this.stop * this.step, 0)
            rotate(this.angle)
        }
        rotate(this.rotateAll);
        pop()
    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}

class OutlineShape extends Layer {
    constructor() {
        super()
        this.weight = randomSelectTwo() ? this.thinStroke : this.thickStroke
        this.hexagonTrue = randomSelectTwo()
        this.alpha = 255;
        this.rotateAll = 0;
    }

    render() {
        noFill();
        stroke(this.layerColor, this.alpha)
        strokeWeight(this.weight)
        push()
            //translate(width/2, height/2)
        if (this.hexagonTrue) {
            hexagon(0, 0, CRYSTAL_SIZE / 2)
        } else {
            ellipse(0, 0, CRYSTAL_SIZE, CRYSTAL_SIZE)
        }
        rotate(this.rotateAll);
        pop()

    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}

class DottedLines extends Layer {
    constructor() {
        super()
        this.numShapes = randomSelectTwo() ? this.sides : this.sides * 2
        this.angle = 360 / this.numShapes
        this.shapeSize = 3
        this.centerOffset = this.singleStep
        this.alpha = 255;
        this.rotateAll = 0;
    }

    render() {
        fill(this.layerColor, this.alpha)
        noStroke()
        push()
            //translate(width / 2, height / 2)
        for (let i = 0; i <= this.numShapes; i++) {
            for (let x = this.centerOffset; x < CRYSTAL_SIZE / 2; x += this.singleStep) {
                rect(x, 0, this.shapeSize, this.shapeSize)
            }
            rotate(this.angle)
        }
        rotate(this.rotateAll)
        pop()


    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}

class CenteredShape extends Layer {
    constructor() {
        super()
        this.randomShape = random(1)
        this.alpha = 255;
        this.shapeSize = floor(random(this.stepsOut / 2, this.stepsOut - 2)) * this.singleStep
        this.rotateAll = 0;
    }

    render() {
        fill(this.layerColor, this.alpha)
        noStroke()
        push()
            // translate(width / 2, height / 2)
        if (this.randomShape < 0.1) {
            rect(0, 0, this.shapeSize * 2, this.shapeSize * 2)
        } else if (this.randomShape >= 0.1 && this.randomShape < 0.6) {
            ellipse(0, 0, this.shapeSize * 2, this.shapeSize * 2)
        } else if (this.randomShape >= 0.6) {
            rotate(this.angle / 2)
            hexagon(0, 0, this.shapeSize)
        }
        rotate(this.rotateAll)
        pop()
    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}

class RingOfShapes extends Layer {
    constructor() {
        super()
        this.steps = floor(random(1, this.stepsOut))
        this.center = this.steps * this.singleStep
        this.randomShape = random(1)
        this.direction = randomSelectTwo() // used for triangle only
        this.fillColor = randomSelectTwo() ? this.layerColor : color(0, 1)
        this.weight = randomSelectTwo() ? this.thinStroke : this.thickStroke
        this.alpha = 255;
        this.rotateAll = 0;


        if (this.steps < this.stepsOut / 2) {
            this.radius = floor(random(1, this.steps)) * this.singleStep
        } else if (this.steps > this.stepsOut / 2) {
            this.radius = floor(random(1, this.stepsOut - this.steps)) * this.singleStep
        } else {
            this.radius = floor(random(1, (this.stepsOut / 2) + 1)) * this.singleStep
        }
    }

    render() {
        stroke(this.layerColor, this.alpha)
        fill(this.fillColor)
        strokeWeight(this.weight)
        push()
            //translate(width / 2, height / 2)
        for (let i = 0; i < this.numShapes; i++) {
            if (this.randomShape < 0.33) {
                ellipse(0, this.center, this.radius, this.radius)
            } else if (this.randomShape >= 0.33 && this.randomShape < 0.66) {
                rect(0, this.center, this.radius, this.radius)
            } else if (this.randomShape >= 0.66) {
                myTriangle(this.center, this.radius, this.direction)
            }
            rotate(this.angle)
        }
        rotate(this.rotateAll)
        pop()
    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}

class SteppedHexagons extends Layer {
    constructor() {
        super()
        this.numSteps = randomSelectTwo() ? this.stepsOut : this.stepsOut * 1.25
        this.centerOffset = (CRYSTAL_SIZE / 2) * 0.15
        this.singleStep = ((CRYSTAL_SIZE / 2) - this.centerOffset) / this.numSteps
        this.weight = randomSelectTwo() ? this.thinStroke : this.thickStroke
        this.alpha = 255;
        this.rotateAll = 0;
    }

    render() {
        stroke(this.layerColor, this.alpha)
        noFill()
        strokeWeight(this.weight)
        push()
            //translate(width / 2, height / 2)
        rotate(this.angle / 2)
        for (let i = 1; i < this.numSteps + 1; i++) {
            hexagon(0, 0, this.centerOffset + (i * this.singleStep))
        }
        rotate(this.rotateAll);
        pop()
    }
    animate() {
        if (this.alpha > 0) {
            this.alpha -= 3
            this.rotateAll += 3
        }
    }
}