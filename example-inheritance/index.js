"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const assert = require("assert");
const { injectable, injected, getInstance } = require("..");
function meta(Class) { }
let Wheel = class Wheel {
    constructor() {
        this.count = 4;
    }
};
Wheel = tslib_1.__decorate([
    injectable
], Wheel);
let Vihicle = class Vihicle {
    constructor(name, wheel) {
        this.name = name;
        this.wheel = wheel;
    }
};
Vihicle = tslib_1.__decorate([
    injectable,
    tslib_1.__metadata("design:paramtypes", [Object, Wheel])
], Vihicle);
let Car = class Car extends Vihicle {
    constructor(name = "Car", wheel) {
        super(name, wheel);
    }
};
Car = tslib_1.__decorate([
    meta,
    tslib_1.__metadata("design:paramtypes", [Object, Wheel])
], Car);
let Truck = class Truck extends Vihicle {
    constructor(name = "Truck", wheel) {
        super(name, wheel);
        this.wheel.count = 6;
    }
};
Truck = tslib_1.__decorate([
    meta,
    tslib_1.__metadata("design:paramtypes", [Object, Wheel])
], Truck);
let Bike = class Bike extends Vihicle {
    constructor(name = "Bike", wheel) {
        super(name, wheel);
        this.wheel.count = 2;
    }
};
Bike = tslib_1.__decorate([
    meta,
    tslib_1.__metadata("design:paramtypes", [Object, Wheel])
], Bike);
let MotorBike = class MotorBike extends Bike {
    constructor(name = "MotorBike", wheel) {
        super(name, wheel);
    }
};
MotorBike = tslib_1.__decorate([
    meta,
    tslib_1.__metadata("design:paramtypes", [Object, Wheel])
], MotorBike);
let Unknown = class Unknown extends Vihicle {
};
Unknown = tslib_1.__decorate([
    meta
], Unknown);
class MyVihicle {
}
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Car)
], MyVihicle.prototype, "car", void 0);
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Bike)
], MyVihicle.prototype, "bike", void 0);
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", MotorBike)
], MyVihicle.prototype, "motorBike", void 0);
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Truck)
], MyVihicle.prototype, "truck", void 0);
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", Unknown)
], MyVihicle.prototype, "unknown", void 0);
var myVihicle = getInstance(MyVihicle);
assert.ok(myVihicle instanceof MyVihicle);
assert.ok(myVihicle.bike instanceof Bike);
assert.equal(myVihicle.bike.name, "Bike");
assert.ok(myVihicle.bike.wheel instanceof Wheel);
assert.equal(myVihicle.bike.wheel.count, 2);
assert.ok(myVihicle.car instanceof Car);
assert.equal(myVihicle.car.name, "Car");
assert.ok(myVihicle.car.wheel instanceof Wheel);
assert.equal(myVihicle.car.wheel.count, 4);
assert.ok(myVihicle.motorBike instanceof MotorBike);
assert.equal(myVihicle.motorBike.name, "MotorBike");
assert.ok(myVihicle.motorBike.wheel instanceof Wheel);
assert.equal(myVihicle.motorBike.wheel.count, 2);
assert.ok(myVihicle.truck instanceof Truck);
assert.equal(myVihicle.truck.name, "Truck");
assert.ok(myVihicle.truck.wheel instanceof Wheel);
assert.equal(myVihicle.truck.wheel.count, 6);
assert.ok(myVihicle.unknown instanceof Unknown);
assert.equal(myVihicle.unknown.name, undefined);
assert.ok(myVihicle.unknown.wheel instanceof Wheel);
assert.equal(myVihicle.unknown.wheel.count, 4);
console.log("#### OK ####");
//# sourceMappingURL=index.js.map