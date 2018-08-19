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
        [__dependencies]?: { [prop: string]: Class };
        init?(...args: any[]): this | void;
    }

    /**
     * Sets the class to be injectable as a dependency.
     * @param defaults The default data passed to the class Class.
     */
    export function injectable<T>(defaults?: any[]): (Class: T) => void;
    export function injectable<T>(Class: T, defaults?: any[]): void;
    export function injectable(): any {
        let args = arguments;
        if (typeof args[0] == "function") { // signature 2
            let Class: Class = args[0];
            Class[__injectable] = true;

            if (args[1])
                Class[__defaults] = args[1];
        } else { // signature 1
            return (Class: Class) => injectable(Class, args[0]);
        }
    }

    /** Sets the property to be dependent to it's type. */
    export function injected(proto: any, prop: string, desc?: PropertyDescriptor): void {
        let Type: Class = Reflect.getOwnMetadata("design:type", proto, prop);

        if (!desc && typeof Type == "function" && Type[__injectable]) {
            let Class = proto.constructor,
                dependencies = Class[__dependencies] || {};

            dependencies[prop] = Type;
            Class[__dependencies] = dependencies;
        }
    }

    function getArgs(paramTypes: any[], defaults?: any[]) {
        let args: any[] = [];

        for (let i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                args[i] = getInstance(paramTypes[i]);
            } else if (defaults && defaults[i] !== undefined) {
                args[i] = defaults[i];
            } else {
                args[i] = undefined;
            }
        }

        return args;
    }

    /**
     * Gets a instance according to the given class, and inject dependencies 
     * automatically and recursively.
     * @param Class The class you want to get instance of.
     */
    export function getInstance<T extends Class>(Class: new (...args) => T): T {
        let instance: T = null;

        // The program will lookup constructor signature, and try to inject 
        // dependencies accordingly, if a parameter doesn't have dependency, or
        // the dependency can not be found, then `undefined` will be passed.
        let defaults: any[] = Class[__defaults] || [],
            paramTypes: any[] = Reflect.getMetadata("design:paramtypes", Class);

        instance = new Class(...getArgs(paramTypes || defaults, defaults));

        let dependencies = Class[__dependencies] || {};

        for (let x in dependencies) {
            if (dependencies[x][__injectable]) {
                instance[x] = getInstance(<any>dependencies[x]);
            } else {
                instance[x] = undefined;
            }
        }

        if (typeof instance.init == "function") {
            let paramTypes: any[] = Reflect.getMetadata("design:paramtypes", Class.prototype, "init");
            instance.init(...getArgs(paramTypes || []));
        }

        return instance;
    }
}

export = DI;