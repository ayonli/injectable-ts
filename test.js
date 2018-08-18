var isNode6 = parseInt(process.version.slice(1)) >= 6;

if (isNode6) require("./example");
require("./example-es5");
if (isNode6) require("./example-inheritance");