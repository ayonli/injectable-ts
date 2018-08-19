"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const assert = require("assert");
const { injectable, inject, getInstance } = require("..");
var logs = [];
let Car = class Car {
    constructor(speed = 60) {
        this.speed = speed;
    }
};
Car = tslib_1.__decorate([
    injectable,
    tslib_1.__metadata("design:paramtypes", [Object])
], Car);
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
    constructor() {
        this.car.run();
    }
}
tslib_1.__decorate([
    inject(Jeep),
    tslib_1.__metadata("design:type", Car)
], David.prototype, "car", void 0);
class Helen {
    constructor() {
        this.car.run();
    }
}
tslib_1.__decorate([
    inject(Audi, [80]),
    tslib_1.__metadata("design:type", Car)
], Helen.prototype, "car", void 0);
let Hugo = class Hugo {
    constructor(car) {
        car.run();
    }
};
Hugo = tslib_1.__decorate([
    tslib_1.__param(0, inject(Audi, [40])),
    tslib_1.__metadata("design:paramtypes", [Car])
], Hugo);
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
//# sourceMappingURL=index.js.map