import * as assert from "assert";
import { injectable, injected, getInstance } from "./index";

@injectable(["ABC"])
class A {
    str: string;
    str2: string;

    constructor (str: string) {
        this.str = str;
    }
}

@injectable
class B {
    a: A;

    constructor(a: A) {
        this.a = a;
    }
}

@injectable
class C {
    @injected
    b: B;
}

@injectable
class D {
    @injected
    a: A;

    b: B;
    c: C;

    constructor(b: B, c: C) {
        this.b = b;
        this.c = c;
    }
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
injectable(E, ["ABC"]);

class F {
    @injected
    e: E;
}

var f = getInstance(F);

assert.ok(f instanceof F);
assert.ok(f.e instanceof E);
assert.ok(f.e.str == "ABC");

console.log("#### OK ####");