"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const assert = require("assert");
const { injectable, injected, getInstance } = require("..");
let A = class A {
    constructor(str) {
        this.str = str;
    }
};
A = tslib_1.__decorate([
    injectable(["ABC"]),
    tslib_1.__metadata("design:paramtypes", [String])
], A);
let B = class B {
    constructor(a) {
        this.a = a;
    }
};
B = tslib_1.__decorate([
    injectable,
    tslib_1.__metadata("design:paramtypes", [A])
], B);
let C = class C {
};
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", B)
], C.prototype, "b", void 0);
C = tslib_1.__decorate([
    injectable
], C);
let D = class D {
    constructor(b, c) {
        this.b = b;
        this.c = c;
    }
};
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", A)
], D.prototype, "a", void 0);
D = tslib_1.__decorate([
    injectable,
    tslib_1.__metadata("design:paramtypes", [B, C])
], D);
var d = getInstance(D);
assert.ok(d instanceof D);
assert.ok(d.a instanceof A);
assert.ok(d.b instanceof B);
assert.ok(d.c instanceof C);
assert.ok(d.c.b instanceof B);
assert.ok(d.c.b.a instanceof A);
assert.ok(d.c.b.a.str == "ABC");
assert.ok(d.c.b.a.str2 === undefined);
class E {
    constructor(str, str2 = "CDA") {
        this.str2 = str2;
        this.str = str;
    }
}
injectable(E, ["ABC"]);
class F {
}
tslib_1.__decorate([
    injected,
    tslib_1.__metadata("design:type", E)
], F.prototype, "e", void 0);
var f = getInstance(F);
assert.ok(f instanceof F);
assert.ok(f.e instanceof E);
assert.ok(f.e.str == "ABC");
assert.ok(f.e.str2 == "CDA");
console.log("#### OK ####");
//# sourceMappingURL=index.js.map