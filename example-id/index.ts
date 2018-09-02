// If your dependencies are circular, it would be unable to import them 
// successfully because they haven't finishing initiation. But you can use 
// interfaces and string ids to define these dependencies.

import "source-map-support/register";
import * as assert from "assert";
import { CarConstructor, Car } from "./car";
import { Driver, DriverConstructor } from "./driver";
const { getInstance } = require("..");

var car: Car = new CarConstructor;
var driver: Driver = getInstance("driver");

assert.ok(car.driver instanceof DriverConstructor);
assert.ok(driver.car instanceof CarConstructor);

console.log("#### OK ####");