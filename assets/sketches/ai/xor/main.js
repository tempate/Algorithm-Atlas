let nn;
let slider;

let trainingData = [
  {inputs: [0,0], outputs: [0]},
  {inputs: [0,1], outputs: [1]},
  {inputs: [1,0], outputs: [1]},
  {inputs: [1,1], outputs: [0]}
];

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas");
  canvas.mousePressed(setup);

  nn = new NeuralNetwork([2,5,5,1]);
  // slider = createSlider(0.01, 0.5, 0.1, 0.01);
}

function draw() {
  background(17);

  for (let data, i = 0; i < 1000; i++) {
    data = trainingData[i%4];
    nn.train_supervised(data.inputs, data.outputs);
  }

  // nn.learning_rate = slider.value();

  const size = 10;
  const cols = width / size;
  const rows = height / size;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let inputs = [i / cols, j / rows];
      let y = nn.predict(inputs);

      noStroke();
      fill(17+y*238);
      rect(i * size, j * size, size, size);
    }
  }
}
