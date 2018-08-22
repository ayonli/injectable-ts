# Injectable-TS

**The simplest way of Dependency Injection for TypeScript.**

This package doesn't require setting the dependency class to any function,
but only depends on the type definition itself.

## Install

```sh
npm i injectable-ts
```

## Usage

To turn on Dependency Injection Support, you need to set the following options
in `tsconfig.json` to `true`:

```json
{
    "compilerOptions": {
        // ...
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        // ..
    },
    // ...
}
```

Then you can use the functions in your project:

```typescript
import * as assert from "assert";
// There are only three main functions in the the package.
import { injectable, injected, getInstance } from "injectable-ts";

@injectable // Set the class to be injectable
class A {
    str: string;
    str2: string;

    // Set default data in the parameter.
    constructor(str: string = "ABC") {
        this.str = str;
    }
}

@injectable
class B {
    a: A;

    // Constructor parameters will be auto-injected with required dependencies.
    constructor(a: A) {
        this.a = a;
    }
}

@injectable
class C {
    // Instead define dependencies in the constructor, using `injected` to define
    // the dependency on the property would be more efficient and good-looking.
    @injected
    b: B;

    // You can pass data to `injected()`, the data will be used as arguments 
    // when instantiating the dependency class.
    @injected(["ABCD"])
    a: A;
}

// Using both constructor injection and `injected` on property are supported, 
// but DO NOT set them to the same property.
@injectable
class D {
    a: A;

    @injected
    b: B;

    @injected
    c: C;

    str: string;

    // You can even use `injected()` here to set data for the dependency, BUT 
    // should remember the dependencies in the constructor doesn't required 
    // specifying `injected`, them will be injected anyway. And you must not 
    // directly using `@injected` in the constructor, must use it as a function 
    // with data.
    constructor(@injected(["AB"]) a: A, str: string) {
        this.a = a;
        this.str = str;
    }
}

// Get instance and pass data to the constructor, since `a` will be 
// auto-injected, so pass it `undefined` instead.
var d: D = getInstance(D, [void 0, "ASDF"]);

assert.ok(d instanceof D);
assert.equal(d.str, "ASDF");
assert.ok(d.a instanceof A);
assert.equal(d.a.str, "AB");
assert.ok(d.b instanceof B);
assert.ok(d.c instanceof C);
assert.ok(d.c.b instanceof B);
assert.ok(d.c.b.a instanceof A);
assert.equal(d.c.b.a.str, "ABC");
assert.equal(d.c.b.a.str2, undefined);

class E {
    str: string;

    constructor(str: string, public str2 = "CDA") {
        this.str = str;
    }
}

// Calling `injectable()` as a function and passing the class will be very 
// useful to make previous written code (or third party packages) injectable.
injectable(E);

// Even if you don't set this class injectable, it still could be used by 
// `getInstance`. (but it could not be injected to other classes.)
class F {
    // Set data for parameter `str`, and `str2` will remain 'CDA'.
    @injected(["ABC"])
    e: E;

    str: string;

    constructor(str: string) {
        this.str = str;
    }
}

var f: F = getInstance(F);

assert.ok(f instanceof F);
assert.ok(f.e instanceof E);
assert.equal(f.e.str, "ABC");
assert.equal(f.e.str2, "CDA");

console.log("#### OK ####"); // will output #### OK ####
```

## Injection With Abstract Classes And Interfaces

By default, when using `@injected` to decorate a property (or parameter), it 
assumes the corresponding type is instantiable, which means it's not suitable
for abstract classes and interfaces, so you have to use another function 
`inject()`. Please check the [example](./example-abstract/index.ts).

## Difference Between Constructor Injection And Property Injection

The dependencies in the constructor parameters are injected at the very time of 
instantiation, but the dependency defined on the property is not, they will be 
lazy-load, which means only if you call them, otherwise they will not be 
injected. Both these dependencies are available in the constructor and any where
inside or outside (must be `public`) the class. 
Please check the [example](./example-lazyload/index.ts).

Worth mentioned that since the dependencies defined in the constructor are 
instantiated before the current class, so there would not be the `dependent` 
property (described bellow) available, because the instantiation hasn't been 
finished yet. It's a very good habit to always define dependencies on the 
property definition.

Another benefit of defining property dependencies is that you don't have to call 
`getInstance()` to get a instance, but use the common way, calling keyword `new`,
please check the [example](./example-new/index.ts) to get comfortable with it.

## Inheritance Support

If a class is decorated with `@injectable`, or it extends the base class 
`Injectable`, then itself and its offspring are all injectable to other 
classes. Please check the [example](./example-inheritance/index.ts).

Any injectable class, when injected to a instance, it will carry a read-only 
property `dependent`, which reference to the that instance, so you can always 
know the current instance has been injected into what dependent target.

```typescript
class A extends Injectable {
    constructor() {
        if (this.dependent)
            console.log("The current instance is a dependency of:", this.dependent.constructor.name);
    }
}

class B extends Injectable {
    @injected
    a: A;
}

class C extends Injectable {
    constructor(public a: A) { }
}

var b = getInstance(B);
var c = getInstance(C);

// Will only output: 'The current instance is a dependency of: B'.
// Because the dependencies defined in the constructor doesn't have the property
// 'dependent'.
```

## Initiative Injection

Sometimes an already defined class, e.g. from a third party package, that you 
want to add additional abilities onto it when using, commonly you can just 
define a new class to extends it, but here I would say, you can inject 
dependencies into it instead. Check the following example:

```typescript
import { SomeClass } from "somewhere";
import { injectable, inject } from "injectable-ts";

@injectable
class Service {
    // ....
}

// `inject()` is a pure JavaScript function which returns a new function that 
// accepts a class prototype and a property name.
// This code will inject `Service` into SomeClass (you can pass the second 
// argument `data: any[]` to inject() for instantiation as well).
inject(Service)(SomeClass.prototype, "service");

// Since TypeScript supports declaration merging, so you can add the property 
// to the class declaration and consider it as an interface.
declare interface SomeClass {
    service: Service;
}

// When you accessing `service`, it will return a new Service instance as 
// expected.

var instance = new SomeClass();
console.log(instance.service instanceof Service); // => true
```

## Support of JavaScript

Apparently this package works with JavaScript perfectly, with exception of 
constructor injection (since JavaScript doesn't have type definition) and 
decorators, but the remaining features are all perfect for JavaScript, instead 
of using decorators, calling `injetable()` and `inject()` directly, and don't 
use `injected`, which you've seen a lot from above examples.