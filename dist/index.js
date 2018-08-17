"use strict";
require("reflect-metadata");
var DI;
(function (DI) {
    var CONTAINER = {
        Classes: new Set,
        initials: new Map,
        props: new Map,
    };
    function injectable() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0] == "function") {
            CONTAINER.Classes.add(args[0]);
            if (args[1])
                CONTAINER.initials.set(args[0], args[1]);
        }
        else {
            return function (constructor) {
                injectable(constructor);
                CONTAINER.initials.set(constructor, args[0]);
            };
        }
    }
    DI.injectable = injectable;
    function injected(proto, prop) {
        var type = Reflect.getOwnMetadata("design:type", proto, prop);
        if (CONTAINER.Classes.has(type)) {
            var props = CONTAINER.props.get(proto.constructor) || {};
            props[prop] = type;
            CONTAINER.props.set(proto.constructor, props);
        }
    }
    DI.injected = injected;
    function getInstance(constructor) {
        var instance = null;
        if (constructor.prototype.hasOwnProperty("constructor")) {
            var initials = CONTAINER.initials.get(constructor) || [], paramTypes = Reflect.getOwnMetadata("design:paramtypes", constructor) || initials, params = [];
            if (paramTypes.length) {
                for (var i in paramTypes) {
                    if (CONTAINER.Classes.has(paramTypes[i])) {
                        params[i] = getInstance(paramTypes[i]);
                    }
                    else if (initials) {
                        params[i] = initials[i];
                    }
                    else {
                        params[i] = undefined;
                    }
                }
            }
            instance = Object.create(constructor.prototype);
            constructor.apply(instance, params);
        }
        else {
            instance = new constructor;
        }
        var props = CONTAINER.props.get(constructor) || {};
        for (var x in props) {
            if (CONTAINER.Classes.has(props[x])) {
                instance[x] = getInstance(props[x]);
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