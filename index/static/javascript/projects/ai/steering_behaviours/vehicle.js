const mutationRate = 0.1;

class Vehicle {
  constructor(x, y, dna) {
      this._a = createVector(0, 0);
      this._v = createVector(0, -2);
      this._p = createVector(x, y);

      this._health = 1;

      this._dna = this.setupDNA(dna);
  }

  setupDNA(dna) {
      let new_dna = {
          "food_weight": random(-1, 1),
          "poison_weight": random(-1, 1),
          "food_radius": random(100),
          "poison_radius": random(100),
          "max_speed": random(4,8),
          "max_force": random(2)
      }

      // Mutate randomly
      for (let i in dna) {
          if (random() < mutationRate) {
              new_dna[i] = (new_dna[i] + dna[i]) / 2;
          } else {
              new_dna[i] = dna[i];
          }
      }

      return new_dna;
  }

  // Method to update location
  update() {
      this._health -= 0.01;
      // Update velocity
      this._v.add(this._a);
      // Limit speed
      this._v.limit(this._dna["max_speed"]);
      this._p.add(this._v);
      // Reset acceleration after each cycle
      this._a.mult(0);
  }

  applyForce(force) {
      // We could add mass here if we want A = F / M
      this._a.add(force);
  }

  behaviors(good, bad) {
      let steerFood = this.eat(good, food_value, this._dna["food_radius"]);
      let steerPoison = this.eat(bad, poison_value, this._dna["poison_radius"]);

      steerFood.mult(this._dna["food_weight"] * 2);
      steerPoison.mult(this._dna["poison_weight"] * 2);

      this.applyForce(steerFood);
      this.applyForce(steerPoison);
  }

  clone() {
      return new Vehicle(this._p.x, this._p.y, this._dna);
  }

  eat(list, nutrition, perception) {
      let record = Infinity;
      let closest = null;

      for (let i = list.length - 1; i >= 0; i--) {
        let d = this._p.dist(list[i]);

        if (d < this._dna["max_speed"] && this._health < 1) {
          list.splice(i, 1);
          this._health += nutrition;
        } else if (d < record && d < perception * 100) {
          record = d;
          closest = list[i];
        }
      }

      return closest ? this.seek(closest) : createVector();
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
      let desired = p5.Vector.sub(target, this._p);  // A vector pointing from the location to the target

      // Scale to maximum speed
      desired.setMag(this._dna["max_speed"]);

      // Steering = Desired minus velocity
      let steer = p5.Vector.sub(desired, this._v);
      steer.limit(this._dna["max_force"]);  // Limit to maximum steering force

      return steer;
  }

  dead() {
      return this._health <= 0;
  }

  boundaries() {
      let d = 25;
      let desired = null;

      if (this._p.x < d) {
        desired = createVector(this._dna["max_speed"], this._v.y);
      } else if (this._p.x > width - d) {
        desired = createVector(-this._dna["max_speed"], this._v.y);
      }

      if (this._p.y < d) {
        desired = createVector(this._v.x, this._dna["max_speed"]);
      } else if (this._p.y > height - d) {
        desired = createVector(this._v.x, -this._dna["max_speed"]);
      }

      if (desired) {
        desired.normalize();
        desired.mult(this._dna["max_speed"]);
        let steer = p5.Vector.sub(desired, this._v);
        steer.limit(this._dna["max_force"]);
        this.applyForce(steer);
      }
  }

  display() {
      // Draw a triangle rotated in the direction of velocity
      let angle = this._v.heading() + PI/2;

      noFill();
      stroke(color(255,0,0));
      ellipse(this._p.x, this._p.y, this._dna["poison_radius"]);

      noFill();
      stroke(color(0,255,0));
      ellipse(this._p.x, this._p.y, this._dna["food_radius"]);

      push();
      translate(this._p.x, this._p.y);
      rotate(angle);

      let colour = lerpColor(color(255, 0, 0), color(0, 255, 0), this._health);

      fill(colour);
      stroke(colour);

      beginShape();
      vertex(0, -radius * 2);
      vertex(-radius, radius * 2);
      vertex(radius, radius * 2);
      endShape();

      pop();
  }
}
