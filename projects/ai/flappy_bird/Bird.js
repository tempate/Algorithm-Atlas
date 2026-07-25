class Bird {
  constructor(brain) {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 20;

    this.gravity = 0.8;
    this.speed = 0;
    this.lift = -18;

    // Neural Network
    this.brain = (brain) ? brain.copy() : new NeuralNetwork([5,8,8,2]);
    this.brain.mutate();

    // Genetic algorithm
    this.score = 0;
    this.fitness = 0.0;
  }

  up() {
    this.speed += this.lift;
  }

  think(pipes) {
    let closest;

    for (let pipe of pipes) {
      if (pipe.x - this.x > 0) {
        closest = pipe;
        break;
      }
    }

    let inputs = [
      map(this.y, 0, height, 0, 1),
      map(this.speed, -5, 5, 0, 1),
      map(closest.x, 0, width, 0, 1),
      map(closest.height, height/4, height/2, 0, 1),
      map(closest.height+closest.space, height/4+125, height/2+200, 0, 1),
    ];

    let outputs = this.brain.predict(inputs);
    if (outputs[1] > outputs[0]) this.up();
  }

  update() {
    this.speed += this.gravity;
    this.y += this.speed;

    if (this.y >= height - this.size / 2) {
      this.y = height - this.size / 2;
      this.speed = 0;
      return false;
    } else if (this.y <= this.size / 2) {
      this.y = this.size / 2;
      this.speed = 0;
      return false;
    }

    for (let pipe of pipes) {
      if (pipe.hits(this))
        return false;
    }

    this.score++;
    return true;
  }

  show() {
    stroke(255);
    fill(255, 100);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
