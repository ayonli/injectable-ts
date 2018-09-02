"use strict";
var tslib_1 = require("tslib");
require("reflect-metadata");
process.emitWarning = process.emitWarning || function emitWarning(warning, name) {
    warning = warning instanceof Error ? warning.toString() : ((name || "Warning") + ": " + warning);
    console.warn(warning);
};
var DI;
(function (DI) {
    var __injectable = Symbol("__injectable");
    var __dependent = Symbol("__dependent");
    var __paramTypes = Symbol("__paramTypes");
    var __paramData = Symbol("__paramData");
    var Container = {};
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
        var args = Array.prototype.slice.apply(arguments);
        if (typeof args[0] == "function") {
            var Class = args[0];
            Class[__injectable] = true;
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
        else if (typeof args[0] == "string") {
            var id_1 = args[0];
            if (typeof args[1] == "function") {
                var Class = args[1];
                Container[id_1] = Class;
                return injectable(Class);
            }
            else {
                return function (Class) { return injectable(id_1, Class); };
            }
        }
        else {
            return function (Class) { return injectable(Class); };
        }
    }
    DI.injectable = injectable;
    function inject(Class, data) {
        if (typeof Class != "function" && typeof Class != "string")
            throw new TypeError("The dependency must be a class constructor or a string id.");
        else if (typeof Class == "function" && !Class[__injectable])
            throw new TypeError("The given class is not injectable.");
        return function (target, prop, paramIndex) {
            if (prop && paramIndex === undefined) {
                var _prop_1 = Symbol(prop);
                Object.defineProperty(target, prop, {
                    get: function () {
                        if (!this[_prop_1]) {
                            Class = typeof Class == "function" ? Class : Container[Class];
                            this[_prop_1] = Class ? getInstance.call(this, Class, data) : null;
                        }
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
    function getInstance() {
        var instance = null, data = arguments[1], Class;
        if (typeof arguments[0] == "string") {
            Class = Container[arguments[0]];
        }
        else {
            Class = arguments[0];
        }
        var paramTypes = Reflect.getMetadata("design:paramtypes", Class), args = [];
        if (!paramTypes)
            paramTypes = Object.assign([], data);
        Object.assign(paramTypes, Class[__paramTypes]);
        for (var i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                var _data = Class[__paramData] && Class[__paramData][i];
                args[i] = getInstance(paramTypes[i], _data);
            }
            else if (data && data[i] !== undefined) {
                args[i] = data[i];
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