"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const assert = require("assert");
const { injectable, injected, getInstance } = require("..");
var logs = [];
var log1 = "The engine is started!";
var log2 = "The wheels are running!";
let Engine = class Engine {
    start() {
        logs.push(log1);
    }
};
Engine = tslib_1.__decorate([
    injectable
], Engine);
let Wheel = class Wheel {
    run() {
        logs.push(log2);
    }
};
Wheel = tslib_1.__decorate([
    injectable
], Wheel);
class Car {
    constructor() {
        this.engine.start();
        this.wheel.run();
    }
}
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Engine)
], Car.prototype, "engine", void 0);
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Wheel)
], Car.prototype, "wheel", void 0);
var car1 = getInstance(Car);
assert.deepStrictEqual(logs, [log1, log2]);
var car2 = new Car;
assert.ok(car2.engine instanceof Engine);
assert.notStrictEqual(car2.engine, car1.engine);
console.log("#### OK ####");
//# sourceMappingURL=index.js.map