"use strict";
require("reflect-metadata");
var DI;
(function (DI) {
    var Container = {
        classes: new Set(),
        initials: new Map(),
        props: new Map(),
    };
    function injectable() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0] == "function") {
            Container.classes.add(args[0]);
            if (args[1])
                Container.initials.set(args[0], args[1]);
        }
        else {
            return function (constructor) {
                injectable(constructor);
                Container.initials.set(constructor, args[0]);
            };
        }
    }
    DI.injectable = injectable;
    function injected(proto, prop) {
        var type = Reflect.getOwnMetadata("design:type", proto, prop);
        if (Container.classes.has(type)) {
            var props = Container.props.get(proto.constructor) || {};
            props[prop] = type;
            Container.props.set(proto.constructor, props);
        }
    }
    DI.injected = injected;
    function getInstance(constructor) {
        var instance = null;
        if (constructor.prototype.hasOwnProperty("constructor")) {
            var initials = Container.initials.get(constructor) || [], paramTypes = Reflect.getOwnMetadata("design:paramtypes", constructor) || initials, params = [];
            if (paramTypes.length) {
                for (var i in paramTypes) {
                    if (Container.classes.has(paramTypes[i])) {
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
            instance = new constructor();
        }
        var props = Container.props.get(constructor) || {};
        for (var x in props) {
            if (Container.classes.has(props[x])) {
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