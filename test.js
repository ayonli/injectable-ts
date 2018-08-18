var isOldNode = parseInt(process.version.slice(1)) < 6;

require("./example");
if (!isOldNode) require("./example-inheritance");
if (!isOldNode) require("./example-lazyload");