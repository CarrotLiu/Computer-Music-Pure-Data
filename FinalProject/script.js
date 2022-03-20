// layout

let GrpC = [];
let GrpB = [];
let GrpA = [];
let Grp = [];
let GRPNum;
let note1, note2, note3;
let notes = [];
ALL_CRYSTALS = [];
var noteIndex;

function setup() {
    background(0);
    createCanvas(windowWidth, windowHeight);
    GrpC = [48, 52, 55, 60, 64, 67, 72, 76, 79];
    GrpB = [47, 52, 55, 59, 64, 67, 71, 76, 79];
    GrpA = [45, 48, 52, 57, 60, 64, 69, 72, 76];
    Grp = [GrpC, GrpB, GrpA];
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    drawOrbits();
    orbitBall(30, 0.027);
    orbitBall(60, 0.025);
    orbitBall(90, 0.023);
    orbitBall(120, 0.021);
    orbitBall(150, 0.019);
    orbitBall(180, 0.017);
    orbitBall(210, 0.015);
    orbitBall(240, 0.013);
    orbitBall(270, 0.011);
}

function drawOrbits() {
    let dia = 0.001;
    let fillColor = "#013E48";
    Pd.receive('rando', function(rando) {
        console.log('received a message from "someName" : ', rando)
        noteIndex = rando[0];
        console.log(noteIndex);
    })
    push();
    strokeWeight(3);
    noFill();
    for (let i = 0; i < 9; i++) {
        dia += 60;
        if (noteIndex == i || noteIndex + 1 == i || noteIndex + 2 == i) {
            fillColor = "#E0EAEC";
        } else {
            fillColor = "#83ADB4";
        }
        stroke(fillColor);
        circle(0, 0, dia);
    }
    pop();
}

function orbitBall(ampball, varyfreq) {
    let fillColor = "#CDF3F9";
    push();
    let freqball = frameCount * varyfreq;
    let px = sin(freqball) * ampball;
    let py = cos(freqball) * ampball;
    let rx = 10 + sin(freqball) * ampball * 0.12;
    let rl = rx + 10;
    let colorRed = sin(freqball) * ampball * 2;
    Pd.receive('rando', function(rando) {
        console.log('received a message from "someName" : ', rando)
        noteIndex = rando[0];
        console.log(noteIndex);
    })
    for (let i = 0; i < 9; i++) {
        if (noteIndex == i || noteIndex + 1 == i || noteIndex + 2 == i) {
            fill(colorRed, 178, 122);
        } else {
            fill(colorRed, 188, 133);
        }
        strokeWeight(6);
        stroke(0);
        circle(px, py, rx);
    }
    pop();
}



function keyPressed() {
    Pd.send('Pdstart', [1]);
}

function generateChord(GrpNum) {
    let noteIndex = int(random(0, 6));
    console.log(noteIndex);
    if (GrpNum == 1) {
        note1 = Grp[0][noteIndex];
        note2 = Grp[0][noteIndex + 1];
        note3 = Grp[0][noteIndex + 2];
    } else if (GrpNum == 2) {
        note1 = Grp[1][noteIndex];
        note2 = Grp[1][noteIndex + 1];
        note3 = Grp[1][noteIndex + 2];
    } else if (GrpNum == 3) {
        note1 = Grp[2][noteIndex];
        note2 = Grp[2][noteIndex + 1];
        note3 = Grp[2][noteIndex + 2];
    } else if (GrpNum == 4) {
        note1 = Grp[1][noteIndex];
        note2 = Grp[1][noteIndex + 1];
        note3 = Grp[1][noteIndex + 2];
    }
    console.log(note1)
    console.log(note2)
    console.log(note3)


    notes = [note1, note2, note3];
    return notes
}