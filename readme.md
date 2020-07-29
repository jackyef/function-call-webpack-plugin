# function-call-webpack-plugin

A webpack plugin that accepts a function name, and a callback that will be called with the arguments that were passed to the original function. The callback will be called during the webpack build time.

This was written as an exercise because of this StackOverflow question: [Webpack plugin to statically analyze the usage of an exported function?](https://stackoverflow.com/questions/63041086/webpack-plugin-to-statically-analyze-the-usage-of-an-exported-function)

## Steps
1. Install dependencies
    ```
    yarn
    ```

2. Run webpack
    ```
    yarn webpack
    ```

## Illustration
Given this source code:
```js
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
```

And this webpack configuration:
```js
const FunctionCallPlugin = require('./webpack-plugins/FunctionCall');

module.exports = {
  plugins: [ new FunctionCallPlugin({ functionName: 'log', callback: ({ arguments: args }) => {
    console.log('`log` function was found and called with the arguments:', args);
    // you can do whatever here, make a http request, write to db, etc
  }})],
}
```

This is the terminal outputs when running webpack:
```sh
➜  webpack-plugin-function-invoke git:(master) ✗ yarn webpack
yarn run v1.16.0
warning ..\package.json: No license field
$ D:\Projects\webpack-plugin-function-invoke\node_modules\.bin\webpack
`log` function was found and called with the arguments: [ 1 ]
`log` function was found and called with the arguments: [ 2, 3 ]
`log` function was found and called with the arguments: [ 2, 'foo' ]
`log` function was found and called with the arguments: [ 2, 'foo', 4, 'bar' ]
`log` function was found and called with the arguments: [ 2, 'foo', 4, 'bar', [ 1, 2, 'asd' ] ]
`log` function was found and called with the arguments: [
  2,
  'foo',
  4,
  { foo: 'bar' },
  [ { a: 'asd', b: 123, c: [] } ]
]
```

### How the plugin works
 1. It loops through all webpack chunks, and all modules inside of each chunks to see if they have any dependencies with the specified name. For example, if you are looking for `log`, it will find any modules that either does `import { log } from './somewhere'` or `import log from './somewhere'`
 2. For every modules that have the specified dependencies, it collect all the file paths to the original source code by looking at its `fileDependencies`
 3. Each of the files' source code are read as string using `fs` module
 4. The source code are parsed into an AST using babel parser
 5. The AST is traversed and we look into all `CallExpression` that uses the same specified function name
 6. We collect all the arguments used in the function call
 7. We run the specified callback, while passing the collected arguments
