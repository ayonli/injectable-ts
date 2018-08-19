import "reflect-metadata";

let warningEmitted = false;

process.emitWarning = process.emitWarning || function emitWarning(warning: string | Error, name?: string) {
    warning = warning instanceof Error ? warning.toString() : ((name || "Warning") + ": " + warning);
    console.warn(warning);
}

/**
 * The simplest Dependency Injection framework for TypeScript.
 * This package doesn't require setting the dependency class to any function,
 * but only depends on the type definition itself.
 */
namespace DI {
    const __injectable = Symbol("__injectable");
    const __defaults = Symbol("__defaults");
    const __dependent = Symbol("__dependent");
    const __paramTypes = Symbol("__paramTypes");
    const __paramData = Symbol("__paramData");

    interface Class extends Function {
        [__injectable]?: boolean;
        [__defaults]?: any[];
    }

    /**
     * The interface exports a `dependent` object that reference to the instance 
     * which depends on the current instance.
     */
    export interface Injectable {
        /**
         * The instance that depends on the current instance, will be 
         * auto-injected when the instance is created by `getInstance()`.
         */
        readonly dependent?: Injectable;
    }

    /**
     * If a new defined class extends this base class, then it will be 
     * automatically injectable.
     * @class
     */
    @injectable
    export class Injectable implements Injectable {
        /** 
         * Gets a new instance and perform dependency injection automatically.
         * @param data The data passed to the constructor when instantiating.
         */
        static getInstance(data?: any[]) {
            return getInstance(<any>this, data);
        }
    }

    /**
     * Sets the class to be injectable as a dependency.
     * @param defaults [deprecated] The default data passed to the class constructor.
     */
    export function injectable(defaults?: any[]): (Class: Class) => void;
    export function injectable(Class: Class, defaults?: any[]): void;
    export function injectable(): any {
        let args = arguments;

        if (typeof args[0] == "function") { // signature 2
            let Class: Class = args[0];
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

            // Sets the read-only property `dependent` for the instance, the 
            // dependent will be temporarily stored in the constructor, and when
            // accessing to it, remove immediately and restore it in the 
            // instance.
            Object.defineProperty(Class.prototype, "dependent", {
                get() {
                    if (!this[__dependent] && this.constructor[__dependent]) {
                        this[__dependent] = this.constructor[__dependent];
                        delete this.constructor[__dependent];
                    }

                    return this[__dependent]
                }
            });
        } else { // signature 1
            return (Class: Class) => injectable(Class, args[0]);
        }
    }

    /**
     * Sets the property/parameter to be a dependency according to the given type.
     * @param Class The class you want to get instance of.
     * @param data The data passed to the dependency when instantiating.
     */
    export function inject(Class: Class, data?: any[]) {
        return (target: any, prop?: string, paramIndex?: number) => {
            if (typeof Class != "function")
                throw new TypeError("The dependency must be a class.");
            else if (!Class[__injectable])
                throw new TypeError("The given class is not injectable.");

            if (prop && paramIndex === undefined) {
                // decorate property
                let _prop = Symbol(prop);
                Object.defineProperty(target, prop, {
                    enumerable: true,
                    get() {
                        if (!this[_prop])
                            this[_prop] = getInstance.call(this, Class, data);

                        return this[_prop];
                    },
                    set(instance) {
                        this[_prop] = instance;
                    }
                });
            } else if (!prop && paramIndex !== undefined) {
                // decorate constructor parameter
                target[__paramTypes] = target[__paramTypes] || [];
                target[__paramTypes][paramIndex] = Class;
                target[__paramData] = target[__paramData] || [];
                target[__paramData][paramIndex] = data;
            }
        }
    }

    /** Sets the property/parameter to be a dependency according to its type. */
    export function injected(proto: any, prop: string): void;
    /**
     * @param data The data passed to the dependency when instantiating.
     */
    export function injected(data: any[]): (target: any, prop?: string, paramIndex?: number) => void
    export function injected(): any {
        let args = arguments;

        if (args.length >= 2) {
            let proto = args[0],
                prop = args[1],
                data = args[2],
                Type: Class = Reflect.getOwnMetadata("design:type", proto, prop);

            return inject(Type, data)(proto, prop);
        } else {
            return (target: any, prop?: string, paramIndex?: number) => {
                if (prop && paramIndex === undefined) {
                    // decorate property
                    injected.call(undefined, target, prop, args[0]);
                } else if (!prop && paramIndex !== undefined) {
                    // decorate constructor parameter
                    target[__paramData] = target[__paramData] || [];
                    target[__paramData][paramIndex] = args[0];
                }
            };
        }
    }

    /**
     * Gets a instance according to the given class, injects dependencies 
     * automatically and recursively.
     * @param Class The class you want to get instance of.
     * @param data The data passed to the constructor when instantiating.
     */
    export function getInstance<T>(Class: new (...args) => T, data?: any[]): T {
        let instance: T = null;

        // The program will lookup constructor signature, and try to inject 
        // dependencies accordingly, if a parameter doesn't have dependency, or
        // the dependency can not be found, then `undefined` will be passed.
        let defaults: any[] = Class[__defaults],
            paramTypes: any[] = Reflect.getMetadata("design:paramtypes", Class),
            args: any[] = [];

        if (!paramTypes) paramTypes = Object.assign([], defaults, data);
        
        // Merger parameter types and the types passed to `inject()`.
        Object.assign(paramTypes, Class[__paramTypes]);

        for (let i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                let _data = Class[__paramData] && Class[__paramData][i];
                args[i] = getInstance(paramTypes[i], _data);
            } else if (data && data[i] !== undefined) {
                args[i] = data[i];
            } else if (defaults && defaults[i] !== undefined) {
                args[i] = defaults[i];
            } else {
                args[i] = undefined;
            }
        }

        // Temporarily store the dependent in the class, and remove it 
        // immediately after the instance access to it. 
        Class[__dependent] = this;
        instance = new Class(...args);
        instance["dependent"]; // Access to the dependent so to remove it.

        return instance;
    }
}

export = DI;