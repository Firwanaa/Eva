const Eva = require('../Eva');
const Environment = require('../Environment');
const evaParser = require('../parser/evaParser');
// Tests: Test Driven development
const tests = [
  require('./self-eval-test.js'),
  require('./math-test.js'),
  require('./variables-test.js'),
  require('./block-test.js'),
  require('./if-test.js'),
  require('./while-test.js'),
  require('./comparison-test'),
  require('./built-in-function-test'),
  require('./user-defined-function-test'),
  require('./lambda-function-test'),
  require('./switch-test'),
];

const eva = new Eva();

tests.forEach((test) => test(eva));

eva.eval(['print', '"Hello"', '"World!"']);

console.log('All assertions passed!');
