"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("source-map-support/register");
var assert = require("assert");
var _a = require(".."), injectable = _a.injectable, injected = _a.injected, getInstance = _a.getInstance;
var A = (function () {
    function A(str) {
        if (str === void 0) { str = "ABC"; }
        this.str = str;
    }
    A = tslib_1.__decorate([
        injectable,
        tslib_1.__metadata("design:paramtypes", [String])
    ], A);
    return A;
}());
var B = (function () {
    function B(a) {
        this.a = a;
    }
    B = tslib_1.__decorate([
        injectable,
        tslib_1.__metadata("design:paramtypes", [A])
    ], B);
    return B;
}());
var C = (function () {
    function C() {
    }
    tslib_1.__decorate([
        injected,
        tslib_1.__metadata("design:type", B)
    ], C.prototype, "b", void 0);
    tslib_1.__decorate([
        injected(["ABCD"]),
        tslib_1.__metadata("design:type", A)
    ], C.prototype, "a", void 0);
    C = tslib_1.__decorate([
        injectable
    ], C);
    return C;
}());
var D = (function () {
    function D(a, str) {
        this.a = a;
        this.str = str;
    }
    tslib_1.__decorate([
        injected,
        tslib_1.__metadata("design:type", B)
    ], D.prototype, "b", void 0);
    tslib_1.__decorate([
        injected,
        tslib_1.__metadata("design:type", C)
    ], D.prototype, "c", void 0);
    D = tslib_1.__decorate([
        injectable,
        tslib_1.__param(0, injected(["AB"])),
        tslib_1.__metadata("design:paramtypes", [A, String])
    ], D);
    return D;
}());
var d = getInstance(D, [void 0, "ASDF"]);
assert.ok(d instanceof D);
assert.equal(d.str, "ASDF");
assert.ok(d.a instanceof A);
assert.equal(d.a.str, "AB");
assert.ok(d.b instanceof B);
assert.ok(d.c instanceof C);
assert.ok(d.c.b instanceof B);
assert.ok(d.c.b.a instanceof A);
assert.equal(d.c.b.a.str, "ABC");
assert.equal(d.c.b.a.str2, undefined);
var E = (function () {
    function E(str, str2) {
        if (str2 === void 0) { str2 = "CDA"; }
        this.str2 = str2;
        this.str = str;
    }
    return E;
}());
injectable(E);
var F = (function () {
    function F(str) {
        this.str = str;
    }
    tslib_1.__decorate([
        injected(["ABC"]),
        tslib_1.__metadata("design:type", E)
    ], F.prototype, "e", void 0);
    return F;
}());
var f = getInstance(F);
assert.ok(f instanceof F);
assert.ok(f.e instanceof E);
assert.equal(f.e.str, "ABC");
assert.equal(f.e.str2, "CDA");
console.log("#### OK ####");
//# sourceMappingURL=index.js.map