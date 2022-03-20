let px, py;
let angle = 0;
let fr = 15;

function setup() {
    createCanvas(windowWidth, windowHeight);

}

function draw() {
    background(50, 89, 100);

    px = width / 2;
    py = map(sin(angle), -1, 1, 500, 200);
    fill(255, 0, 0);
    noStroke();
    let amplitudePd;
    amplitudePd = map(py, 200, 500, 0, 1);
    circle(px, py, 35);

    Pd.send('amplitudePd', [amplitudePd]);
    // console.log(amplitudePd);
    angle += 0.05;
}