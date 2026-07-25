class Hook {
  constructor() {
    this.x = width / 2;
    this.y = 50;
    this.speed = 10;

    this.moving = [];
    this.grabbed = false;
    this.placed = false;
  }

  move(block, x, y) {
    this.moving.push([block, x, y]);
  }

  work() {
    if (!this.grabbed) {
      this.grab(this.moving[0][0]);
    } else if (!this.placed) {
      this.place.apply(this, this.moving[0]);
    } else if (this.y != 50) {
      this.y -= this.speed;
    } else {
      this.moving.splice(0, 1);
      this.grabbed = false;
      this.placed = false;
    }
  }

  grab(block) {
    if (this.x != block.x + block.width / 2) {
      this.x += (this.x > block.x + block.width / 2) ? -this.speed : this.speed;
    } else if (this.y != block.y - block.height) {
      this.y += this.speed;
    } else if (this.y != 50) {
      this.y -= this.speed;
      block.y -= this.speed;
    } else {
      this.grabbed = true;
    }
  }

  place(block, x, y) {
    if (this.x != x + block.width / 2) {
      this.steer = (this.x > x + block.width / 2) ? -this.speed : this.speed;
      this.x += this.steer;
      block.x += this.steer;
    } else if (this.y != y - block.height) {
      this.y += this.speed;
      block.y += this.speed;
    } else {
      this.placed = true;
    }
  }

  show() {
    fill("#F00");
    stroke(0);
    rect(this.x - 50, this.y, 100, 4);

    fill(50);
    stroke(0);
    rect(this.x - 5, 0, 10, this.y);
  }
}
