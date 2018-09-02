"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const { injectable, inject } = require("..");
let DriverConstructor = class DriverConstructor {
};
tslib_1.__decorate([
    inject("car"),
    tslib_1.__metadata("design:type", Object)
], DriverConstructor.prototype, "car", void 0);
DriverConstructor = tslib_1.__decorate([
    injectable("driver")
], DriverConstructor);
exports.DriverConstructor = DriverConstructor;
//# sourceMappingURL=driver.js.map