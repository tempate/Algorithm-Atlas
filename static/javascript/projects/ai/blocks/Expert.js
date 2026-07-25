class Expert {
  constructor(blocks, hook) {
    this.blocks = blocks;
    this.hook = hook;
    this.job = [];
  }

  work() {
    if (this.hook.moving.length) {
      this.hook.work();
    }

    if (this.job.length === 2) {
      this.job[0].color = "#F00";
      this.job[1].color = "#0F0";
      this.put_on(this.job[0], this.job[1]);
      this.job = [];
    }
  }

  put_on(a, b) {
    if (b instanceof Block) {
      this.clear_top(b);
      this.move(a, b.x, b.y - b.height);
    } else {
      this.move(a, b[0], b[1]);
    }
  }

  move(block, x, y) {
    this.clear_top(block);
    this.hook.move(block, x, y);
  }

  clear_top(block) {
    for (let i = 1; i < block.top.length; i++)
      this.get_rid_of(block.top[i]);
  }

  get_rid_of(block) {
    this.put_on(block, this.find_space());
  }

  find_space() {
    let places = [];

    for (let i = 100; i < 500; i += 100) {
      if (this.job[0].x !== i && this.job[1].x !== i)
        places.push(i);
    }

    let x = random(places);
    let y = height;

    for (let block of this.blocks) {
      if (block.x === x) {
        for (let block_ of concat(block.top, block.bottom))
          y -= block_.height;
        break;
      }
    }

    return [x,y];
  }

  read() {

  }

  answer(input) {

  }
}
