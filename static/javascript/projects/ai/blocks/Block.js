class Block {
  constructor(id) {
    this.id = id;
    this.width = 100; //random() > 0.7 ? 200 : 100;
    this.height = 100; //random() > 0.7 ? 200 : 100;
    this.color = "#" + int(noise(id+1) * 65535).toString(16);

    this.top = [this];
    this.bottom = [];
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(this.color);
    rect(this.x, this.y - this.height, this.width, this.height);
    stroke(0);
  }
}
