function nextGeneration() {
  calculateFitness();
  for (let i = 0; i < n; i++)
    birds[i] = newBird();
  deadBirds = [];
}

function newBird() {
  let choose = random();

  let index;
  for (index = 0; choose > 0; index++)
    choose -= deadBirds[index].fitness;

  return new Bird(deadBirds[index-1].brain);
}

function calculateFitness() {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    deadBirds[i].score = pow(deadBirds[i].score, 2);
    sum += deadBirds[i].score;
  }

  // Normalize fitness
  for (let i = 0; i < n; i++)
    deadBirds[i].fitness = deadBirds[i].score / sum;
}
