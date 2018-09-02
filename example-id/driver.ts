// This script won't import 'driver.js' when compile since it's an interface, 
// thus keep the module clean. the script will be import in 'index.js'.

import { Car } from "./car";
const { injectable, inject } = require("..");

export interface Driver {
    car: Car;
}

@injectable("driver")
export class DriverConstructor implements Driver {
    @inject("car")
    car: Car;
}