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
// the are only three new keywords in the this package.
import { injectable, injected, getInstance } from "./index";

@injectable // sets the class to be injectable.
class A {
    str: string;

    // default data can be set in parameter as well, just like what you would do:
    constructor(str: string = "ABC") {
        this.str = str;
    }
}

@injectable
class B {
    a: A;

    // because this class has its own constructor, so its paramter will be 
    // auto injected  with required dependency.
    constructor(a: A) {
        this.a = a;
    }
}

@injectable
class C {
    // this class doesn't have its own constructor, so use `injected` to define
    // the dependency.
    @injected
    b: B;
}

@injectable
// using both constructor injection and `injected` on property are supported, 
// but DO NOT set them to the same property. 
class D {
    @injected
    a: A;

    constructor(public b: B, public c: C) { }
} 

var d = getInstance(D);

assert.ok(d instanceof D);
assert.ok(d.a instanceof A);
assert.ok(d.b instanceof B);
assert.ok(d.c instanceof C);
assert.ok(d.c.b instanceof B);
assert.ok(d.c.b.a instanceof A);
assert.ok(d.c.b.a.str == "ABC");

class E {
    str: string;

    constructor(str: string) {
        this.str = str;
    }
}

// calling `injectable` as a function and passing the class will be very useful 
// to make privious written code (or  third party packages) injectable.
injectable(E, ["ABC"]);

// even if you don't set this class injectable, it still cound be used by 
// `getInstance`. (but it could not be injected to other classes.)
class F {
    @injected
    e: E;
}

var f = getInstance(F);

assert.ok(f instanceof F);
assert.ok(f.e instanceof E);
assert.ok(f.e.str == "ABC");

console.log("#### OK ####"); // will output #### OK ####
```

## More About Default Data

When you pass default data to `injectable()`, the order should be equal to the 
constructor's parameters, if the corresponding parameter doesn't have default 
data, then `undefined` should be passed. Default data should remain dependencies
`undefined` because they will always be injected with dependency instances, 
unless the dependency could not be found.

Although you are allowed to set default data by passing them to `injectable()`, 
but it's not a recommended way, since you already can set them in the 
constructor definition. But, if you want to make those classes that are not 
decorated with `@injectable`, say a class from a third party package, injectable,
it would be very useful to use `injectable()` with default data to do so.

```typescript
// The way to set dafault data in this class is recommended.
@injectable
class A {
    str: string; // or juest set here

    constructor(str = "default string") {
        this.str = str;
    }
}

// But the way in this class is not recommended, although it works the same in 
// most situations. Except with inheritance, which may cause problem if the 
// child class doesn't accept the same parameter types as the super class do.
@injectable(["default string"])
class B {
    str: string;

    constructor(str) {
        this.str = str;
    }
}
```

## Difference Between Constructor Injection And Property Injection

The dependencies in the constructor parameters are injected at the very time of 
instantiation, but the dependency defined on the property is not, they will be 
lazy-load, which means only if you call them, otherwise they will not be 
injected. Both these dependencies are available in the constructor and any where
inside or outside (must be `public`) the class. 
Please check the [example](./example-lazyload/index.ts).

## Inheritance Support

If a class is decorated with `@injectable`, or it extends the base class 
`Injectable`, then itself and it's offspring are all injectable to other 
classes. Please check the [example](./example-inheritance/index.ts).

Any injectable class, when injected to a instance, it will carry a read-only 
property `dependent`, which reference to the that instance, so you can always 
know the current instance has been injected into what dependent target.