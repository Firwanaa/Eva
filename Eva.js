const assert = require('assert');
const Enviroment = require('./Enviroment');
/*
 *Eva interpreter
 * */
class Eva {
  /**
   * Creates an Eva instance with the global environment.
   */
  constructor(global = new Enviroment()) {
    this.global = global;
  }
  /**
   * Evaluates an expression in the given environment.
   */
  eval(exp, env = this.global) {
    // remove later
    env.printEnvRecord();
    // -------------------------------------------
    // Self-evaluating expressions:
    if (isNumber(exp)) {
      return exp;
    }
    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    // -------------------------------------------
    // Math operations:
    if (exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }
    if (exp[0] === '-') {
      return this.eval(exp[1]) - this.eval(exp[2]);
    }
    if (exp[0] === '*') {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }
    if (exp[0] === '/') {
      return this.eval(exp[1]) / this.eval(exp[2]);
    }
    // -------------------------------------------
    // Variables decleration:
    if (exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value));
    }
    // -------------------------------------------
    // Variables access:
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }
}

function isNumber(exp) {
  return typeof exp === 'number';
}
function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}
function isVariableName(exp) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}
// -------------------------------------------
// Tests: Test Driven development
const eva = new Eva(
  new Enviroment({
    null: null,

    true: true,
    false: false,

    VERSION: '1.0',
  })
);
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');

// Math:
assert.strictEqual(eva.eval(['+', 1, 5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
assert.strictEqual(eva.eval(['-', 5, 4]), 1);
assert.strictEqual(eva.eval(['-', ['-', 3, 2], 1]), 0);
assert.strictEqual(eva.eval(['*', 2, 5]), 10);
assert.strictEqual(eva.eval(['*', ['*', 2, 5], 2]), 20);
assert.strictEqual(eva.eval(['/', 4, 2]), 2);
assert.strictEqual(eva.eval(['/', ['/', 8, 2], 2]), 2);

// Variables:
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);
assert.strictEqual(eva.eval(['var', 'y', 100]), 100);
assert.strictEqual(eva.eval('y'), 100);
assert.strictEqual(eva.eval('VERSION'), '1.0');

// var isUser = true;
assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);
assert.strictEqual(eva.eval('isUser'), true);

assert.strictEqual(eva.eval(['var', 'z', ['*', 2, 3]]), 6);
assert.strictEqual(eva.eval('z'), 6);

console.log('All assertions passed!');
