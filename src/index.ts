import "reflect-metadata";

/**
 * The simplest Dependency Injection framework for TypeScript.
 * This package doesn't require setting the dependency class to any function,
 * but only depends on the type definition itself.
 */
namespace DI {
    const CONTAINER = {
        Classes: new Set,
        initials: new Map,
        props: new Map,
    };

    /**
     * Sets the class to be injectable as a dependency.
     * @param initials The initial data passed to the class constructor.
     */
    export function injectable(initials?: any[]): (constructor: Function) => void;
    export function injectable(constructor: Function, initials?: any[]): void;
    export function injectable(...args): any {
        if (typeof args[0] == "function") { // signature 2
            CONTAINER.Classes.add(args[0]);

            if (args[1])
                CONTAINER.initials.set(args[0], args[1]);
        } else { // signature 1
            return function (constructor: Function) {
                injectable(constructor);
                CONTAINER.initials.set(constructor, args[0]);
            }
        }
    }

    /** Sets the property to be dependent to it's type. */
    export function injected(proto: any, prop: string): void {
        let type: any = Reflect.getOwnMetadata("design:type", proto, prop);

        if (CONTAINER.Classes.has(type)) {
            let props = CONTAINER.props.get(proto.constructor) || {};
            props[prop] = type;
            CONTAINER.props.set(proto.constructor, props);
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
            let initials: any[] = CONTAINER.initials.get(constructor) || [],
                paramTypes: any[] = Reflect.getOwnMetadata("design:paramtypes", constructor) || initials,
                params: any[] = [];

            if (paramTypes.length) {
                for (let i in paramTypes) {
                    if (CONTAINER.Classes.has(paramTypes[i])) {
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
            instance = new (<any>constructor);
        }

        let props = CONTAINER.props.get(constructor) || {};

        for (let x in props) {
            if (CONTAINER.Classes.has(props[x])) {
                instance[x] = getInstance(props[x]);
            } else {
                instance[x] = undefined;
            }
        }

        return instance;
    }
}

export = DI;