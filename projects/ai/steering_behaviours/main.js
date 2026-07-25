const mutation_rate = 0.1;
const birth_rate = 0.0025;

const food_value = 0.2;
const poison_value = -0.75;
const radius = 4;

const initial_vehicles = 300;
const initial_food = 600;
const initial_poison = 150;

let vehicles, food, poison;
let generation = 0;
let score;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent("canvas");
    canvas.mousePressed(reset);

    setupScore();
    reset();
}

function reset() {
    vehicles = [];
    food = [];
    poison = [];
    generation = 0;

    for (let i = 0; i < initial_vehicles; i++)
        vehicles.push(new Vehicle(random(width), random(height)));

    for (let i = 0; i < initial_food; i++)
        food.push(createVector(random(width), random(height)));

    for (let i = 0; i < initial_poison; i++)
        poison.push(createVector(random(width), random(height)));
}

function setupScore() {
    score = createP("");
    score.parent("score");
}

function draw() {
  background(17);

  if (food.length < initial_food / 1.5 && random() < 0.4)
    food.push(createVector(random(width), random(height)));

  if (poison.length < initial_poison / 2 && random() < random(0.2))
    poison.push(createVector(random(width), random(height)));

  drawElement(food, color(0, 255, 0));
  drawElement(poison, color(255, 0, 0));

  for (let i = vehicles.length - 1; i >= 0; i--) {
      vehicles[i].boundaries();
      vehicles[i].behaviors(food, poison);
      vehicles[i].update();
      vehicles[i].display();

      // Add food on the death of an agent
      if (vehicles[i].dead()) {
          food.push(createVector(vehicles[i]._p.x, vehicles[i]._p.y));
          vehicles.splice(i, 1);
          // Give birth to a child
      } else if (random() < birth_rate && random() < vehicles[i]._health) {
          vehicles.push(vehicles[i].clone());
          generation++;
      }
  }

  score.html("Generation: " + int(generation / 10));
}

function drawElement(array, colour) {
    for (let i = 0; i < array.length; i++) {
        fill(colour);
        noStroke();
        ellipse(array[i].x, array[i].y, 4, 4);
    }
}
