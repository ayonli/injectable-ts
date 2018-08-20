// Because all the dependencies defined as property are lazy-load, which means 
// they are injected whenever you call them, which also means you don't have to 
// call `getInstance()` at the first place to fetch those dependencies, you can 
// just use the `new` keyword to get a instance, just like how you will do in 
// your past days.

import "source-map-support/register";
import * as assert from "assert";
const { injectable, injected } = require("..");

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

var car1 = new Car; // use `new` instead of `getInstance()`

assert.deepStrictEqual(logs, [log1, log2]);

var car2 = new Car;
assert.ok(car2.engine instanceof Engine);
assert.notStrictEqual(car2.engine, car1.engine);

console.log("#### OK ####");