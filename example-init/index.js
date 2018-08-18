"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const assert = require("assert");
const { injectable, injected, getInstance } = require("..");
var logs = [];
var log1 = "The engine is started!";
var log2 = "The wheels are running!";
var log3 = "The door is closed!";
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
let Door = class Door {
    close() {
        logs.push(log3);
    }
};
Door = tslib_1.__decorate([
    injectable
], Door);
class Car {
    init(door) {
        door.close();
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
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Door]),
    tslib_1.__metadata("design:returntype", void 0)
], Car.prototype, "init", null);
getInstance(Car);
assert.deepStrictEqual(logs, [log3, log1, log2]);
console.log("#### OK ####");
//# sourceMappingURL=index.js.map