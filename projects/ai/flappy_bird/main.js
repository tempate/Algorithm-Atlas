const speed = 3;
const n = 500;
const cycles = 200;

let pipes = new Array(1);
let birds = new Array(n);
let deadBirds = [];
let time = 1;

let bestBird, generation=1, highscore=0, score=0;
let slider, button;

let showNetwork = 0;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas");
  canvas.mousePressed(reset);

  slider = createSlider(1,100,1);
  slider.parent("slider");

  button = createButton("Show network");
  button.parent("button");
  button.class("btn");
  button.mousePressed(showAction);

  reset();
}

function reset() {
  time = 1;
  pipes = [new Pipe()];

  for (let i = 0; i < n; i++)
    birds[i] = new Bird();

  bestBird = birds[0];
  generation = 1;
  highscore = 0;
}

function showAction() {
  showNetwork = 1 - showNetwork;
  (showNetwork) ? noLoop() : loop();
}

/*
function mouseClicked() {
  noLoop();
}
*/

function draw() {
  for (let k = 0; k < slider.value(); k++) {
    if (time++ % 80 === 0)
      pipes.push(new Pipe());

    for (let i = pipes.length-1; i >= 0; i--) {
      if (!pipes[i].update())
        pipes.splice(i, 1);
    }

    if (!birds.length) {
      generation++;
      nextGeneration();
      pipes = [new Pipe()];
      time = 1;
    } else {
      for (let i = birds.length-1; i >= 0; i--) {
        birds[i].think(pipes);
        if (!birds[i].update()) {
          deadBirds.push(birds[i]);
          birds.splice(i, 1);
        } else if (Math.floor(birds[i].score/80) > highscore) {
          bestBird = new Bird(birds[i].brain);
          highscore = Math.floor(birds[i].score/80);
        }
      }
    }
  }

  // Drawing
  background(17);

  if (showNetwork) {
    bestBird.brain.show();
  } else {
    for (let bird of birds)
      bird.show();

    for (let pipe of pipes)
      pipe.show();

    fill(255);
    textSize(16);
    text("Highscore: " + highscore, 10, 32);
    text("Score: " + ((birds.length) ? Math.floor(birds[0].score/80) : 0), 10, 64);
    text("Generation: " + generation, 10, 96);
  }
}

/*
function mouseClicked() {
  birds[0].up();
}
*/
