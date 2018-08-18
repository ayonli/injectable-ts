import "source-map-support/register";
import * as assert from "assert";
// The are only three new keywords in the this package.
const { injectable, injected, getInstance } = require("..");

@injectable(["ABC"]) // sets the class to be injectable and pass default data.
class A {
    str: string;
    str2: string;

    // default data can be set in parameter as well, just like what you would do:
    // constructor (str: string = "ABC")
    // in fact, setting default data in the constructor is recommended.
    constructor(str: string) {
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
assert.ok(d.c.b.a.str2 === undefined);

class E {
    str: string;

    constructor(str: string, public str2 = "CDA") {
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
assert.ok(f.e.str2 == "CDA");

console.log("#### OK ####"); // will output #### OK ####