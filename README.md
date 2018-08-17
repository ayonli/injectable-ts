# Injectable-TS

**The simplest Dependency Injection framework for TypeScript.**

This package doesn't require setting the dependency class to any function,
but only depends on the type definition itself.

# Install

```sh
npm i injectable-ts
```

# Usage

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

@injectable(["ABC"]) // sets the class to be injectable and pass initial data.
class A {
    str: string;
    str2: string;

    // initial data can be set in parameter as well, just like what you would do:
    // constructor (str: string = "ABC")
    constructor (str: string) {
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
// using both constructor dependencies and `injected` are supported, but DO NOT
// set them to the same property. 
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
assert.ok(d.c.b.a.str2 === undefined);

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