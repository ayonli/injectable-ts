"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const { injectable, inject } = require("..");
let CarConstructor = class CarConstructor {
};
tslib_1.__decorate([
    inject("driver"),
    tslib_1.__metadata("design:type", Object)
], CarConstructor.prototype, "driver", void 0);
CarConstructor = tslib_1.__decorate([
    injectable("car")
], CarConstructor);
exports.CarConstructor = CarConstructor;
//# sourceMappingURL=car.js.map