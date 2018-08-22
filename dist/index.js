"use strict";
var tslib_1 = require("tslib");
require("reflect-metadata");
var warningEmitted = false;
process.emitWarning = process.emitWarning || function emitWarning(warning, name) {
    warning = warning instanceof Error ? warning.toString() : ((name || "Warning") + ": " + warning);
    console.warn(warning);
};
var DI;
(function (DI) {
    var __injectable = Symbol("__injectable");
    var __defaults = Symbol("__defaults");
    var __dependent = Symbol("__dependent");
    var __paramTypes = Symbol("__paramTypes");
    var __paramData = Symbol("__paramData");
    var Injectable = (function () {
        function Injectable() {
        }
        Injectable.getInstance = function (data) {
            return getInstance(this, data);
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
            if (args[1]) {
                Class[__defaults] = args[1];
                if (!warningEmitted) {
                    process.emitWarning("setting default data via 'injectable()'"
                        + " is deprecated, please set data via 'injected()'"
                        + " instead.");
                    warningEmitted = true;
                }
            }
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
    function inject(Class, data) {
        return function (target, prop, paramIndex) {
            if (typeof Class != "function")
                throw new TypeError("The dependency must be a class.");
            else if (!Class[__injectable])
                throw new TypeError("The given class is not injectable.");
            if (prop && paramIndex === undefined) {
                var _prop_1 = Symbol(prop);
                Object.defineProperty(target, prop, {
                    get: function () {
                        if (!this[_prop_1])
                            this[_prop_1] = getInstance.call(this, Class, data);
                        return this[_prop_1];
                    },
                    set: function (instance) {
                        this[_prop_1] = instance;
                    }
                });
            }
            else if (!prop && paramIndex !== undefined) {
                target[__paramTypes] = target[__paramTypes] || [];
                target[__paramTypes][paramIndex] = Class;
                target[__paramData] = target[__paramData] || [];
                target[__paramData][paramIndex] = data;
            }
        };
    }
    DI.inject = inject;
    function injected() {
        var args = arguments;
        if (args.length >= 2) {
            var proto = args[0], prop = args[1], data = args[2], Type = Reflect.getOwnMetadata("design:type", proto, prop);
            return inject(Type, data)(proto, prop);
        }
        else {
            return function (target, prop, paramIndex) {
                if (prop && paramIndex === undefined) {
                    injected.call(undefined, target, prop, args[0]);
                }
                else if (!prop && paramIndex !== undefined) {
                    target[__paramData] = target[__paramData] || [];
                    target[__paramData][paramIndex] = args[0];
                }
            };
        }
    }
    DI.injected = injected;
    function getInstance(Class, data) {
        var instance = null;
        var defaults = Class[__defaults], paramTypes = Reflect.getMetadata("design:paramtypes", Class), args = [];
        if (!paramTypes)
            paramTypes = Object.assign([], defaults, data);
        Object.assign(paramTypes, Class[__paramTypes]);
        for (var i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                var _data = Class[__paramData] && Class[__paramData][i];
                args[i] = getInstance(paramTypes[i], _data);
            }
            else if (data && data[i] !== undefined) {
                args[i] = data[i];
            }
            else if (defaults && defaults[i] !== undefined) {
                args[i] = defaults[i];
            }
            else {
                args[i] = undefined;
            }
        }
        Class[__dependent] = this;
        instance = new (Class.bind.apply(Class, [void 0].concat(args)))();
        instance["dependent"];
        return instance;
    }
    DI.getInstance = getInstance;
})(DI || (DI = {}));
module.exports = DI;
//# sourceMappingURL=index.js.map