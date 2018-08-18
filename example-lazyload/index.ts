// This package support classes written in ES5 style, which is a `function`,
// the following classes will be compiled to `ES5` standard, and the assertions 
// should pass.

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