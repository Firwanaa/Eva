const assert = require('assert');
const Environment = require('./Enviroment');
/*
 *Eva interpreter
 * */
class Eva {
  /**
   * Creates an Eva instance with the global environment.
   */
  constructor(global = new Environment()) {
    this.global = global;
  }
  /**
   * Evaluates an expression in the given environment.
   */
  eval(exp, env = this.global) {
    // remove later
    // env.printEnvRecord();
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
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }
    if (exp[0] === '-') {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }
    if (exp[0] === '*') {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }
    if (exp[0] === '/') {
      return this.eval(exp[1], env) / this.eval(exp[2], env);
    }
    // -------------------------------------------
    // Block: sequance of expressions
    if (exp[0] === 'begin') {
      const blockEnv = new Environment({test: 'test'}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // -------------------------------------------
    // Variables decleration: (var foo 10)
    if (exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }
    // -------------------------------------------
    // Variables access: foo
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });
    // console.log('result ' + result);
    return result;
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
  new Environment({
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

// Blocks:
assert.strictEqual(
  eva.eval([
    'begin',
    ['var', 'z', 2],
    ['var', 'x', 30],
    ['var', 'y', 20],
    ['+', ['*', 'x', 'y'], 50],
  ]),
  650
);

assert.strictEqual(
  eva.eval(
    ['begin', 
      ['var', 'x', 10], 
      
      ['begin', 
        ['var', 'x', 20], 
        'x'
      ], 
      'x'
      ]),
  10
);

console.log('All assertions passed!');
