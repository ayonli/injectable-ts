// By default, when using `@injected` to decorate a property (or parameter), it 
// assumes the corresponding type is instantiable, which means it's not suitable
// for abstract classes and interfaces, so you have to use another function 
// `inject()`.
// The following code only gives the example of `abstract class`, interface is
// pretty much the same.

import "source-map-support/register";
import * as assert from "assert";
const { injectable, inject, getInstance } = require("..");

var logs: string[] = [];

@injectable
abstract class Car {
    speed: number;

    constructor(speed = 60) {
        this.speed = speed;
    }

    abstract run(): void;
}

class Jeep extends Car {

    run() {
        logs.push("Jeep is running, speed: " + this.speed + " km/h");
    }
}

class Audi extends Car {
    run() {
        logs.push("Audi is running, speed: " + this.speed + " km/h");
    }
}

class David {
    @inject(Jeep)
    car: Car;

    constructor() {
        this.car.run();
    }
}

class Helen {
    @inject(Audi, [80]) // inject dependency and set data
    car: Car;

    constructor() {
        this.car.run();
    }
}

class Hugo {
    // inject dependency in the constructor
    constructor(@inject(Audi, [40]) car: Car) {
        car.run();
    }
}

var person1 = getInstance(David);
var person2 = getInstance(Helen);
getInstance(Hugo);

assert.ok(person1.car instanceof Car);
assert.equal(person1.car.speed, 60);
assert.ok(person2.car instanceof Car);
assert.equal(person2.car.speed, 80);
assert.deepStrictEqual(logs, [
    "Jeep is running, speed: 60 km/h",
    "Audi is running, speed: 80 km/h",
    "Audi is running, speed: 40 km/h",
]);

console.log("#### OK ####");