"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var assert = require("assert");
var index_1 = require("./index");
var A = (function () {
    function A(str) {
        this.str = str;
    }
    A = tslib_1.__decorate([
        index_1.injectable(["ABC"]),
        tslib_1.__metadata("design:paramtypes", [String])
    ], A);
    return A;
}());
var B = (function () {
    function B(a) {
        this.a = a;
    }
    B = tslib_1.__decorate([
        index_1.injectable,
        tslib_1.__metadata("design:paramtypes", [A])
    ], B);
    return B;
}());
var C = (function () {
    function C() {
    }
    tslib_1.__decorate([
        index_1.injected,
        tslib_1.__metadata("design:type", B)
    ], C.prototype, "b", void 0);
    C = tslib_1.__decorate([
        index_1.injectable
    ], C);
    return C;
}());
var D = (function () {
    function D(b, c) {
        this.b = b;
        this.c = c;
    }
    tslib_1.__decorate([
        index_1.injected,
        tslib_1.__metadata("design:type", A)
    ], D.prototype, "a", void 0);
    D = tslib_1.__decorate([
        index_1.injectable,
        tslib_1.__metadata("design:paramtypes", [B, C])
    ], D);
    return D;
}());
var d = index_1.getInstance(D);
assert.ok(d instanceof D);
assert.ok(d.a instanceof A);
assert.ok(d.b instanceof B);
assert.ok(d.c instanceof C);
assert.ok(d.c.b instanceof B);
assert.ok(d.c.b.a instanceof A);
assert.ok(d.c.b.a.str == "ABC");
assert.ok(d.c.b.a.str2 === undefined);
var E = (function () {
    function E(str) {
        this.str = str;
    }
    return E;
}());
index_1.injectable(E, ["ABC"]);
var F = (function () {
    function F() {
    }
    tslib_1.__decorate([
        index_1.injected,
        tslib_1.__metadata("design:type", E)
    ], F.prototype, "e", void 0);
    return F;
}());
var f = index_1.getInstance(F);
assert.ok(f instanceof F);
assert.ok(f.e instanceof E);
assert.ok(f.e.str == "ABC");
console.log("#### OK ####");
//# sourceMappingURL=test.js.map