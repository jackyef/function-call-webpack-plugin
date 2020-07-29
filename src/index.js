const { log } = require("./helpers/log");

log(1);
log(2, 3);
log(2, "foo");
log(2, "foo", 4, "bar");
log(2, "foo", 4, "bar", [1, 2, "asd"]);
log(2, "foo", 4, "bar", [1, 2, "asd"], { foo: "bar" }, [
  { a: "asd", b: 123, c: [] },
]);
