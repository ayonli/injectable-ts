"use strict";
require("reflect-metadata");
var DI;
(function (DI) {
    var __injectable = Symbol("__injectable");
    var __initials = Symbol("__initials");
    var __dependencies = Symbol("__dependencies");
    function injectable() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0] == "function") {
            args[0][__injectable] = true;
            if (args[1])
                args[0][__initials] = args[1];
        }
        else {
            return function (Class) {
                Class[__injectable] = true;
                Class[__initials] = args[0];
            };
        }
    }
    DI.injectable = injectable;
    function injected(proto, prop) {
        var Class = Reflect.getOwnMetadata("design:type", proto, prop);
        if (typeof Class == "function" && Class[__injectable]) {
            var dependencies = proto.constructor[__dependencies] || {};
            dependencies[prop] = Class;
            proto.constructor[__dependencies] = dependencies;
        }
    }
    DI.injected = injected;
    function getInstance(Class) {
        var instance = null;
        var initials = Class.hasOwnProperty(__initials) ? Class[__initials] : [], paramTypes = Reflect.getOwnMetadata("design:paramtypes", Class) || initials, args = [];
        for (var i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                args[i] = getInstance(paramTypes[i]);
            }
            else if (initials[i]) {
                args[i] = initials[i];
            }
            else {
                args[i] = undefined;
            }
        }
        instance = new (Class.bind.apply(Class, [void 0].concat(args)))();
        var dependencies = Class[__dependencies] || {};
        for (var x in dependencies) {
            if (dependencies[x][__injectable]) {
                instance[x] = getInstance(dependencies[x]);
            }
            else {
                instance[x] = undefined;
            }
        }
        return instance;
    }
    DI.getInstance = getInstance;
})(DI || (DI = {}));
module.exports = DI;
//# sourceMappingURL=index.js.map