import "reflect-metadata";

/**
 * The simplest Dependency Injection framework for TypeScript.
 * This package doesn't require setting the dependency class to any function,
 * but only depends on the type definition itself.
 */
namespace DI {
    const Container = {
        classes: new Set<Function>(),
        initials: new Map<Function, any[]>(),
        props: new Map<Function, { [prop: string]: Function}>(),
    };

    /**
     * Sets the class to be injectable as a dependency.
     * @param initials The initial data passed to the class constructor.
     */
    export function injectable<T>(initials?: any[]): (constructor: T) => void;
    export function injectable<T>(constructor: T, initials?: any[]): void;
    export function injectable(...args): any {
        if (typeof args[0] == "function") { // signature 2
            Container.classes.add(args[0]);

            if (args[1])
                Container.initials.set(args[0], args[1]);
        } else { // signature 1
            return function (constructor: Function) {
                injectable(constructor);
                Container.initials.set(constructor, args[0]);
            }
        }
    }

    /** Sets the property to be dependent to it's type. */
    export function injected(proto: any, prop: string): void {
        let type: Function = Reflect.getOwnMetadata("design:type", proto, prop);

        if (Container.classes.has(type)) {
            let props = Container.props.get(proto.constructor) || {};
            props[prop] = type;
            Container.props.set(proto.constructor, props);
        }
    }

    /**
     * Gets a instance according to the given class, and inject dependencies 
     * automatically and recursively.
     * @param constructor The class you want to get instance of.
     */
    export function getInstance<T>(constructor: new (...args) => T): T {
        let instance: T = null;

        if (constructor.prototype.hasOwnProperty("constructor")) {
            // If the class defines its own constructor, the program will lookup
            // it's signature, and try to inject dependencies accordingly, if a 
            // parameter doesn't have dependency, or the dependency can not be 
            // found, then pass `undefined`.
            let initials: any[] = Container.initials.get(constructor) || [],
                paramTypes: any[] = Reflect.getOwnMetadata("design:paramtypes", constructor) || initials,
                params: any[] = [];

            if (paramTypes.length) {
                for (let i in paramTypes) {
                    if (Container.classes.has(paramTypes[i])) {
                        params[i] = getInstance(paramTypes[i]);
                    } else if (initials) {
                        params[i] = initials[i];
                    } else {
                        params[i] = undefined;
                    }
                }
            }

            instance = Object.create(constructor.prototype);
            constructor.apply(instance, params);
        } else {
            instance = new constructor();
        }

        let props = Container.props.get(constructor) || {};

        for (let x in props) {
            if (Container.classes.has(props[x])) {
                instance[x] = getInstance(<any>props[x]);
            } else {
                instance[x] = undefined;
            }
        }

        return instance;
    }
}

export = DI;