const FunctionCallPlugin = require('./webpack-plugins/FunctionCall');

module.exports = {
  plugins: [ new FunctionCallPlugin({ functionName: 'log', callback: ({ arguments: args }) => {
    console.log('`log` function was found and called with the arguments:', args);
    // you can do whatever here, make a http request, write to db, etc
  }})],
}