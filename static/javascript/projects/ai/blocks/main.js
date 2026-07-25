const nblocks = 8;
let blocks = [];
let action = 0;
let order = [];

let hook, expert;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas");

  randomSeed(2);
  noiseSeed(1);
  randomizePositions();

  hook = new Hook();
  expert = new Expert(blocks, hook);
}

function reset() {
  blocks = [];
  hook = new Hook();
  expert = new Expert(blocks, hook);

  randomizePositions();
}

function draw() {
  background(17);

  expert.work();
  expert.read();

  for (block of blocks)
    block.show();

  hook.show();
}

function mouseClicked() {
  for (let i = 0; i < nblocks; i++) {
    if (mouseX > blocks[i].x &&
        mouseY > blocks[i].y - blocks[i].height &&
        mouseX < blocks[i].x + blocks[i].width &&
        mouseY < blocks[i].y) {
          expert.job.push(blocks[i]);
          break;
    } else if (i === nblocks-1) {
      reset();
      return;
    }
  }
}

function randomizePositions() {
  let x = 100;
  let y = height;

  for (let k = 0, i = 0; i < nblocks; i++) {
    blocks.push(new Block(i));
    let space = blocks[i].width;

    if (y !== height || x >= width - 100) {
      while (blocks[k].top.slice(-1)[0].width < blocks[i].width) k++;

      bottom = blocks[k].top.slice(-1)[0];
      space = blocks[k].width;
      x = bottom.x;
      y = bottom.y - bottom.height;

      blocks[k].top.push(blocks[i]);
      blocks[i].bottom.push(blocks[k]);
      for (let j = 0; j < blocks[k].bottom.length; j++)
        blocks[k].bottom[j].top.push(blocks[i]);

      k++;
    }

    blocks[i].move(x, y);
    x += space;
  }
}
