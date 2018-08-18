import "reflect-metadata";

/**
 * The simplest Dependency Injection framework for TypeScript.
 * This package doesn't require setting the dependency class to any function,
 * but only depends on the type definition itself.
 */
namespace DI {
    const __injectable = Symbol("__injectable");
    const __defaults = Symbol("__defaults");
    const __dependencies = Symbol("__dependencies");

    interface Class extends Function {
        [__injectable]?: boolean;
        [__defaults]?: any[];
        [__dependencies]?: { [prop: string]: Class }
    }

    /**
     * Sets the class to be injectable as a dependency.
     * @param defaults The default data passed to the class Class.
     */
    export function injectable<T>(defaults?: any[]): (Class: T) => void;
    export function injectable<T>(Class: T, defaults?: any[]): void;
    export function injectable(...args): any {
        if (typeof args[0] == "function") { // signature 2
            args[0][__injectable] = true;

            if (args[1])
                args[0][__defaults] = args[1];
        } else { // signature 1
            return function (Class: Class) {
                Class[__injectable] = true;
                Class[__defaults] = args[0];
            }
        }
    }

    /** Sets the property to be dependent to it's type. */
    export function injected(proto: any, prop: string): void {
        let Class: Class = Reflect.getOwnMetadata("design:type", proto, prop);

        if (typeof Class == "function" && Class[__injectable]) {
            let dependencies = proto.constructor[__dependencies] || {};
            dependencies[prop] = Class;
            proto.constructor[__dependencies] = dependencies;
        }
    }

    /**
     * Gets a instance according to the given class, and inject dependencies 
     * automatically and recursively.
     * @param Class The class you want to get instance of.
     */
    export function getInstance<T>(Class: new (...args) => T): T {
        let instance: T = null;

        // The program will lookup constructor signature, and try to inject 
        // dependencies accordingly, if a parameter doesn't have dependency, or
        // the dependency can not be found, then `undefined` will be passed.
        let defaults: any[] = Class.hasOwnProperty(__defaults) ? Class[__defaults] : [],
            paramTypes: any[] = Reflect.getOwnMetadata("design:paramtypes", Class) || defaults,
            args: any[] = [];

        for (let i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                args[i] = getInstance(paramTypes[i]);
            } else if (defaults[i]) {
                args[i] = defaults[i];
            } else {
                args[i] = undefined;
            }
        }

        instance = new Class(...args);

        let dependencies = Class[__dependencies] || {};

        for (let x in dependencies) {
            if (dependencies[x][__injectable]) {
                instance[x] = getInstance(<any>dependencies[x]);
            } else {
                instance[x] = undefined;
            }
        }

        return instance;
    }
}

export = DI;