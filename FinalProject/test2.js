let waves = [];
const CRYSTAL_SIZE = 5;
const SIDES = 6;

// layout
const MARGIN = CRYSTAL_SIZE / 2;
const COLUMNS = 9;
const ROWS = 5;
const PADDING = CRYSTAL_SIZE * 0.2;
const GRIDBOX = CRYSTAL_SIZE + PADDING;
const START = (CRYSTAL_SIZE / 2) + MARGIN;

let PALETTE = [];
ALL_CRYSTALS = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    const totalX = START + GRIDBOX * COLUMNS;
    const totalY = START + GRIDBOX * ROWS;
    for (let i = 0; i < 5; i++) {
        waves[i] = new Wave(random(20, 80), random(100, 600), random(TWO_PI));
    }
    PALETTE = [
        color(238, 235, 221), // white
        color(216, 182, 164), // pink
        color(225, 81, 81), // light red
        color(225, 155, 106), // light orange
        // color(136, 224, 239), //blue
        color(99, 0, 0) //white2
    ];
    // noLoop();
    angleMode(DEGREES);
    rectMode(CENTER);
}

function draw() {
    background(0);
    for (let x = 0; x < COLUMNS; x++) {
        for (let y = 0; y < ROWS; y++) {
            const posX = START + (x * GRIDBOX)
            const posY = START + (y * GRIDBOX)
            ALL_CRYSTALS.push(new Crystal(posX, posY))
        }
    }

    ALL_CRYSTALS.forEach(crystal => {
        // crystal.animate()
        crystal.render()
    })

    for (let x = 0; x < width; x += 5) {
        let y = 0;
        for (let wave of waves) {
            y += wave.evaluate(x);

        }
        ALL_CRYSTALS.push(new Crystal(x, y))
        ALL_CRYSTALS[ALL_CRYSTALS.length - 1].render()
    }

    for (let wave of waves) {
        wave.update();
    }

}

class Wave {
    constructor(amp, period, phase) {
        this.amplitude = amp;
        this.period = period;
        this.phase = phase;
    }

    evaluate(x) {
        return sin(this.phase + (TWO_PI * x) / this.period) * this.amplitude;
    }

    update() {
        this.phase += 0.05;
    }
}