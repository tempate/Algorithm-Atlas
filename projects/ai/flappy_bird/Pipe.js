class Pipe {
  constructor() {
    this.x = width;
    this.width = 50;
    this.height = height/4 * (random() + 1);
    this.space = 125 + random(75);
  }

  hits(bird) {
    return (bird.x >= this.x - bird.size / 2 &&
            bird.x <= this.x + this.width + bird.size / 2 &&
            (bird.y <= this.height + bird.size / 2 ||
            bird.y >= this.height + this.space - bird.size / 2));
  }

  update() {
    this.x -= speed;
    return this.x > -this.width;
  }

  show() {
    noStroke();
    fill(255, 0, 0);
    rect(this.x, 0, this.width, this.height);
    rect(this.x, this.height + this.space, this.width, height);
  }
}
