// If a class is decorated with `@injectable`, then itself and it's offspring
// are all injectable to other classes.
// In this example, since `tsc` will not trigger `emitDecoratorMetadata` option
// if there is no decorator in a class, so the bellowing classes without 
// `@injectable` will be decorated `@meta`, which does nothing but just trigger 
// `tsc` to record metadata of the class.

import "source-map-support/register";
import * as assert from "assert";
const { injectable, injected, getInstance } = require("..");

/** This decorator is used to trigger `tsc` emitting decorator metadata. */
function meta(Class: Function) { }

@injectable
class Wheel {
    count = 4;
}

@injectable
class Vihicle {
    constructor(public name, public wheel: Wheel) { }
}

@meta
class Car extends Vihicle {
    constructor(name = "Car", wheel: Wheel) {
        super(name, wheel);
    }
}

@meta
class Truck extends Vihicle {
    constructor(name = "Truck", wheel: Wheel) {
        super(name, wheel);
        this.wheel.count = 6;
    }
}

@meta
class Bike extends Vihicle {
    constructor(name = "Bike", wheel: Wheel) {
        super(name, wheel);
        this.wheel.count = 2;
    }
}

@meta
class MotorBike extends Bike {
    constructor(name = "MotorBike", wheel: Wheel) {
        super(name, wheel);
    }
}

@meta
class Unknown extends Vihicle { }

class MyVihicle {
    @injected
    car: Car;

    @injected
    bike: Bike;

    @injected
    motorBike: MotorBike;

    @injected
    truck: Truck;

    @injected
    unknown: Unknown;
}

var myVihicle: MyVihicle = getInstance(MyVihicle);

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
assert.ok(myVihicle.unknown.name === undefined);
assert.ok(myVihicle.unknown.wheel === undefined);

console.log("#### OK ####");