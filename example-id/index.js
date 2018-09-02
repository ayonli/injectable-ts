"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const assert = require("assert");
const car_1 = require("./car");
const driver_1 = require("./driver");
const { getInstance } = require("..");
var car = new car_1.CarConstructor;
var driver = getInstance("driver");
assert.ok(car.driver instanceof driver_1.DriverConstructor);
assert.ok(driver.car instanceof car_1.CarConstructor);
console.log("#### OK ####");
//# sourceMappingURL=index.js.map