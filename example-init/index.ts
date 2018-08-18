// A injectable class may have a method `init()` for special use, if such a 
// method is present, then it will be called after the instantiation is complete
// and before `getInstance()` returning the instance, so you can do some initial 
// stuffs in it.

import "source-map-support/register";
import * as assert from "assert";
const { injectable, injected, getInstance } = require("..");

var logs = [];
var log1 = "The engine is started!";
var log2 = "The wheels are running!";
var log3 = "The door is closed!";

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

@injectable
class Door {
    close() {
        logs.push(log3);
    }
}

class Car {
    @injected
    engine: Engine;

    @injected
    wheel: Wheel;

    // using `@injected` here to emit metadata of the method so that it could 
    // support dependency injection as well.
    @injected
    init(door: Door) {
        door.close();
        this.engine.start();
        this.wheel.run();
    }
}

getInstance(Car);

assert.deepStrictEqual(logs, [log3, log1, log2]);

console.log("#### OK ####");