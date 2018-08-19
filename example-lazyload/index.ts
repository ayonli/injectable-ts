// All the dependencies defined as property are lazy-load, which means only if 
// you call them, otherwise they will not be injected, that also means you can 
// use them in the constructor as the dependencies defined in the constructor 
// parameters.

import "source-map-support/register";
import * as assert from "assert";
const { injectable, injected, getInstance } = require("..");

var logs = [];
var log1 = "The engine is started!";
var log2 = "The wheels are running!";

@injectable
class Engine {
    start() {
        logs.push(log1);
    }
}

@injectable
class Wheel {
    run() {
        logs.push(log2);
    }
}

class Car {
    @injected
    engine: Engine;

    @injected
    wheel: Wheel;

    constructor() {
        this.engine.start();
        this.wheel.run();
    }
}

var car1 = getInstance(Car);

assert.deepStrictEqual(logs, [log1, log2]);

var car2 = new Car;
assert.ok(car2.engine instanceof Engine);
assert.notStrictEqual(car2.engine, car1.engine);

console.log("#### OK ####");