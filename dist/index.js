"use strict";
require("reflect-metadata");
var DI;
(function (DI) {
    var __injectable = Symbol("__injectable");
    var __defaults = Symbol("__defaults");
    var __dependencies = Symbol("__dependencies");
    function injectable() {
        var args = arguments;
        if (typeof args[0] == "function") {
            var Class = args[0];
            Class[__injectable] = true;
            if (args[1])
                Class[__defaults] = args[1];
        }
        else {
            return function (Class) { return injectable(Class, args[0]); };
        }
    }
    DI.injectable = injectable;
    function injected(proto, prop, desc) {
        var Type = Reflect.getOwnMetadata("design:type", proto, prop);
        if (!desc && typeof Type == "function" && Type[__injectable]) {
            var Class = proto.constructor, dependencies = Class[__dependencies] || {};
            dependencies[prop] = Type;
            Class[__dependencies] = dependencies;
        }
    }
    DI.injected = injected;
    function getArgs(paramTypes, defaults) {
        var args = [];
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
        return args;
    }
    function getInstance(Class) {
        var instance = null;
        var defaults = Class[__defaults] || [], paramTypes = Reflect.getMetadata("design:paramtypes", Class);
        instance = new (Class.bind.apply(Class, [void 0].concat(getArgs(paramTypes || defaults, defaults))))();
        var dependencies = Class[__dependencies] || {};
        for (var x in dependencies) {
            if (dependencies[x][__injectable]) {
                instance[x] = getInstance(dependencies[x]);
            }
            else {
                instance[x] = undefined;
            }
        }
        if (typeof instance.init == "function") {
            var paramTypes_1 = Reflect.getMetadata("design:paramtypes", Class.prototype, "init");
            instance.init.apply(instance, getArgs(paramTypes_1 || []));
        }
        return instance;
    }
    DI.getInstance = getInstance;
})(DI || (DI = {}));
module.exports = DI;
//# sourceMappingURL=index.js.map