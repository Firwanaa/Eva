const Eva = require('../Eva');
const Environment = require('../Environment');

// Tests: Test Driven development
const tests = [
  require('./self-eval-test.js'),
  require('./math-test.js'),
  require('./variables-test.js'),
  require('./block-test.js'),
  require('./if-test.js'),
  require('./while-test.js'),
  require('./comparison-test'),
];

const eva = new Eva(
  new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '1.0',
  })
);

tests.forEach((test) => test(eva));

console.log('All assertions passed!');
