function f(x) {
  return x + ((random() < 0.1) ? randomGaussian()/2 : 0);
}

class NeuralNetwork {
  constructor(nodes, learning_rate, activation) {
    if (nodes instanceof NeuralNetwork) {
      let nn = nodes;
      this.nodes = nn.nodes;
      this.weights = nn.weights.slice();
      this.biases = nn.biases.slice();
      this.activation = nn.activation;
      this.derivative = nn.derivative;
      this.learning_rate = nn.learning_rate;
    } else {
      // Array with the number of nodes for each layer
      this.nodes = nodes;

      // Set random weights, one between each layer
      this.weights = [];
      this.biases = [];

      for (let weights, biases, i = 0; i < this.nodes.length-1; i++) {
        weights = new Matrix(this.nodes[i+1], this.nodes[i]);
        biases = new Matrix(this.nodes[i+1], 1);
        weights.randomize();
        biases.randomize();
        this.weights.push(weights);
        this.biases.push(biases);
      }

      // Default learning rate: 0.1
      this.learning_rate = learning_rate || 0.1;

      // Default activation function: sigmoid
      if (activation === 'tanh') {
        this.activation = x => Math.tanh(x);
        this.derivative = x => 1 - x*x;
      } else if (activation === 'relu') {
        this.activation = x => (x > 0) ? x : x;
        this.derivative = x => (x > 0) ? 1 : 0.01;
      } else {
        this.activation = x => 1 / (1 + Math.exp(-x));
        this.derivative = x => x * (1 - x);
      }
    }
  }

  predict(inputs_array) {
    // Filter errors
    if (inputs_array.length !== this.nodes[0]) {
      console.log("Input length and input nodes don't match.");
      return;
    }

    // Turn input array into a matrix
    let inputs = Matrix.fromArray(inputs_array);
    let outputs = inputs;

    // Feed forward
    for (let i = 0; i < this.weights.length; i++) {
      inputs = Matrix.multiply(this.weights[i], outputs);
      inputs.add(this.biases[i]);
      outputs = Matrix.map(inputs, this.activation);
    }

    return outputs.toArray();
  }

  train_reinforcement(inputs_array, move, reward, scale) {
    // Filter errors
    if (inputs_array.length !== this.nodes[0]) {
      console.log("Input length and input nodes don't match.");
      return;
    } else if (!(reward === 1 || reward === -1)) {
      console.log("Wrong reward value.");
      return;
    }

    // Turn input and target arrays into matrices
    let inputs = Matrix.fromArray(inputs_array);
    let outputs = [inputs];

    // Feed forward
    for (let i = 0; i < this.weights.length; i++) {
      inputs = Matrix.multiply(this.weights[i], outputs[i]);
      inputs.add(this.biases[i]);
      outputs.push(Matrix.map(inputs, this.activation));
    }

    // Calculate error
    let output = outputs.slice(-1)[0].toArray();
    // Get the value the network chose
    let choice = output.indexOf(move);

    // Compute the error for the chosen value
    let errors = [];
    for (let i = 0; i < this.nodes.slice(-1)[0]; i++)
      errors[i] = 0;

    errors[choice] = reward * scale * this.learning_rate;
    errors = Matrix.fromArray(errors);

    this.backpropagation(outputs, errors);
  }

  train_supervised(inputs_array, targets_array) {
    // Filter errors
    if (inputs_array.length !== this.nodes[0]) {
      console.log("Input length and input nodes don't match.");
      return;
    } else if (targets_array.length !== this.nodes.slice(-1)[0]) {
      console.log("Targets length and output nodes don't match.");
      return;
    }

    // Turn input and target arrays into matrices
    let inputs = Matrix.fromArray(inputs_array);
    let targets = Matrix.fromArray(targets_array);
    let outputs = [inputs];

    // Feed forward
    for (let i = 0; i < this.weights.length; i++) {
      inputs = Matrix.multiply(this.weights[i], outputs[i]);
      inputs.add(this.biases[i]);
      outputs.push(Matrix.map(inputs, this.activation));
    }

    let errors = Matrix.subtract(targets, outputs.slice(-1)[0]);

    this.backpropagation(outputs, errors);
  }

  backpropagation(outputs, errors) {
    let gradient, outputsT, deltaW;
    for (let i = outputs.length-1; i > 0; i--) {
      // Calculate the gradient
      gradient = Matrix.map(outputs[i], this.derivative);
      gradient.multiply(errors);
      gradient.multiply(this.learning_rate);

      // Adjust the weights according to the gradient
      outputsT = Matrix.transpose(outputs[i-1]);
      deltaW = Matrix.multiply(gradient, outputsT);
      this.weights[i-1].add(deltaW);
      this.biases[i-1].add(gradient);

      // Update errors for previous layer
      errors = Matrix.multiply(Matrix.transpose(this.weights[i-1]), errors);
    }
  }

  show() {
    const size = width/20;
    const x = width/(2*this.nodes.length);

    for (let i = 0; i < this.weights.length; i++) {
      const y = height/(2*this.nodes[i]);

      for (let j = 0; j < this.nodes[i]; j++) {
        const y2 = height/(2*this.nodes[i+1]);

        for (let k = 0; k < this.nodes[i+1]; k++) {
          if (this.weights[i].data[k][j] > 0) {
            stroke(0,this.weights[i].data[k][j]*255,0);
          } else {
            stroke(-this.weights[i].data[k][j]*255,0,0);
          }
          strokeWeight(abs(this.weights[i].data[k][j])*2);
          line(2*x*i+x,2*y*j+y,2*x*i+3*x,2*y2*k+y2);
        }
      }
    }

    fill("#FFF");
    stroke("#FFF");
    strokeWeight(1);

    for (let i = 0; i < this.nodes.length; i++) {
      const y = height/(2*this.nodes[i]);

      for (let j = 0; j < this.nodes[i]; j++)
        ellipse(2*x*i+x,2*y*j+y,size,size);
    }
  }

  copy() {
    return new NeuralNetwork(this);
  }

  mutate() {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = Matrix.map(this.weights[i], f);
      this.biases[i] = Matrix.map(this.biases[i], f);
    }
  }
}
