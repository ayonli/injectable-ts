"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("source-map-support/register");
var assert = require("assert");
var _a = require(".."), injectable = _a.injectable, injected = _a.injected, getInstance = _a.getInstance;
var logs = [];
var log1 = "The engine is started!";
var log2 = "The wheels are running!";
var Engine = (function () {
    function Engine() {
    }
    Engine.prototype.start = function () {
        logs.push(log1);
    };
    Engine = tslib_1.__decorate([
        injectable
    ], Engine);
    return Engine;
}());
var Wheel = (function () {
    function Wheel() {
    }
    Wheel.prototype.run = function () {
        logs.push(log2);
    };
    Wheel = tslib_1.__decorate([
        injectable
    ], Wheel);
    return Wheel;
}());
var Car = (function () {
    function Car() {
    }
    Car.prototype.start = function () {
        this.engine.start();
        this.wheel.run();
    };
    tslib_1.__decorate([
        injected,
        tslib_1.__metadata("design:type", Engine)
    ], Car.prototype, "engine", void 0);
    tslib_1.__decorate([
        injected,
        tslib_1.__metadata("design:type", Wheel)
    ], Car.prototype, "wheel", void 0);
    return Car;
}());
var car = getInstance(Car);
car.start();
assert.deepStrictEqual(logs, [log1, log2]);
console.log("#### OK ####");
//# sourceMappingURL=index.js.map