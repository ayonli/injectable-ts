"use strict";
var tslib_1 = require("tslib");
require("reflect-metadata");
var DI;
(function (DI) {
    var __injectable = Symbol("__injectable");
    var __defaults = Symbol("__defaults");
    var __dependent = Symbol("__dependent");
    var Injectable = (function () {
        function Injectable() {
        }
        Injectable.getInstance = function () {
            return getInstance(this);
        };
        Injectable = tslib_1.__decorate([
            injectable
        ], Injectable);
        return Injectable;
    }());
    DI.Injectable = Injectable;
    function injectable() {
        var args = arguments;
        if (typeof args[0] == "function") {
            var Class = args[0];
            Class[__injectable] = true;
            if (args[1])
                Class[__defaults] = args[1];
            Object.defineProperty(Class.prototype, "dependent", {
                get: function () {
                    if (!this[__dependent] && this.constructor[__dependent]) {
                        this[__dependent] = this.constructor[__dependent];
                        delete this.constructor[__dependent];
                    }
                    return this[__dependent];
                }
            });
        }
        else {
            return function (Class) { return injectable(Class, args[0]); };
        }
    }
    DI.injectable = injectable;
    function injected(proto, prop, desc) {
        var Type = Reflect.getOwnMetadata("design:type", proto, prop);
        if (!desc && typeof Type == "function" && Type[__injectable]) {
            var _prop_1 = Symbol(prop);
            Object.defineProperty(proto, prop, {
                enumerable: true,
                get: function () {
                    if (!this[_prop_1])
                        this[_prop_1] = getInstance(Type, this);
                    return this[_prop_1];
                },
                set: function (instance) {
                    this[_prop_1] = instance;
                }
            });
        }
    }
    DI.injected = injected;
    function getInstance(Class, dependent) {
        var instance = null;
        var defaults = Class[__defaults] || [], paramTypes = Reflect.getMetadata("design:paramtypes", Class) || defaults, args = [];
        for (var i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                args[i] = getInstance(paramTypes[i]);
            }
            else if (defaults && defaults[i]) {
                args[i] = defaults[i];
            }
            else {
                args[i] = undefined;
            }
        }
        Class[__dependent] = dependent;
        instance = new (Class.bind.apply(Class, [void 0].concat(args)))();
        instance["dependent"];
        return instance;
    }
    DI.getInstance = getInstance;
})(DI || (DI = {}));
module.exports = DI;
//# sourceMappingURL=index.js.map