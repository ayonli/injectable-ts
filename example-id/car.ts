// This script won't import 'driver.js' when compile since it's an interface, 
// thus keep the module clean. the script will be import in 'index.js'.

import { Driver } from "./driver";
const { injectable, inject } = require("..");

export interface Car {
    driver: Driver;
}

@injectable("car")
export class CarConstructor implements Car {
    @inject("driver")
    driver: Driver;
}