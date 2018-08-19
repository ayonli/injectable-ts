import "source-map-support/register";
import * as assert from "assert";
// The are only three new keywords in the this package.
const { injectable, injected, getInstance } = require("..");

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