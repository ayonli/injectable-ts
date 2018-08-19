import "reflect-metadata";

/**
 * The simplest Dependency Injection framework for TypeScript.
 * This package doesn't require setting the dependency class to any function,
 * but only depends on the type definition itself.
 */
namespace DI {
    const __injectable = Symbol("__injectable");
    const __defaults = Symbol("__defaults");
    const __dependent = Symbol("__dependent");

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
        /** Gets a new instance and perform dependency injection automatically. */
        static getInstance() {
            return getInstance(<any>this);
        }
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

            // sets the read-only property `dependent` for the instance, the 
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

    /** Sets the property to be dependent to it's type. */
    export function injected(proto: any, prop: string): void {
        let Type: Class = Reflect.getOwnMetadata("design:type", proto, prop);

        if (typeof Type == "function" && Type[__injectable]) {
            let _prop = Symbol(prop);
            Object.defineProperty(proto, prop, {
                enumerable: true,
                get() {
                    if (!this[_prop])
                        this[_prop] = getInstance(<any>Type, this);

                    return this[_prop];
                },
                set(instance) {
                    this[_prop] = instance;
                }
            });
        }
    }

    /**
     * Gets a instance according to the given class, injects dependencies 
     * automatically and recursively.
     * @param Class The class you want to get instance of.
     */
    export function getInstance<T>(Class: new (...args) => T, dependent?: any): T {
        let instance: T = null;

        // The program will lookup constructor signature, and try to inject 
        // dependencies accordingly, if a parameter doesn't have dependency, or
        // the dependency can not be found, then `undefined` will be passed.
        let defaults: any[] = Class[__defaults] || [],
            paramTypes: any[] = Reflect.getMetadata("design:paramtypes", Class) || defaults,
            args: any[] = [];

        for (let i in paramTypes) {
            if (typeof paramTypes[i] == "function" && paramTypes[i][__injectable]) {
                args[i] = getInstance(paramTypes[i]);
            } else if (defaults[i] !== undefined) {
                args[i] = defaults[i];
            } else {
                args[i] = undefined;
            }
        }

        // temporarily store the dependent in the class, and remove it 
        // immediately after the instance access to it. 
        Class[__dependent] = dependent;
        instance = new Class(...args);
        instance["dependent"]; // access to the dependent so to remove it.

        return instance;
    }
}

export = DI;