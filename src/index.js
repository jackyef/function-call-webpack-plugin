import { log } from './helpers/log';

// these will be logged
log(1);
log(2, 3);
log(2, "foo");
log(2, "foo", 4, "bar");
log(2, "foo", 4, "bar", [1, 2, "asd"]);
log(2, "foo", 4, "bar", [1, 2, "asd"], { foo: "bar" }, [
  { a: "asd", b: 123, c: [] },
]);

// this one will not be logged because it's using a variable
const a = [1,2,3];
log(a);

// this one will also not be logged because it's not using `log` exactly
console.log('asd');