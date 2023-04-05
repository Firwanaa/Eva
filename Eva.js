const assert = require('assert');
const Environment = require('./Environment');
const Transformer = require('./transform/Transformer');
/*
 *Eva interpreter
 * */
class Eva {
  /**
   * Creates an Eva instance with the global environment.
   */
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this._transformer = new Transformer();
  }
  /**
   * Evaluates an expression in the given environment.
   */
  eval(exp, env = this.global) {
    // remove later
    // env.printEnvRecord();
    // -------------------------------------------
    // Self-evaluating expressions:
    if (this._isNumber(exp)) {
      return exp;
    }
    if (this._isString(exp)) {
      return exp.slice(1, -1);
    }

    // -------------------------------------------
    // Math operations: moved to  Gloabalfunctions

    // if (exp[0] === '+') {
    //   return this.eval(exp[1], env) + this.eval(exp[2], env);
    // }
    // if (exp[0] === '-') {
    //   return this.eval(exp[1], env) - this.eval(exp[2], env);
    // }
    // if (exp[0] === '*') {
    //   return this.eval(exp[1], env) * this.eval(exp[2], env);
    // }
    // if (exp[0] === '/') {
    //   return this.eval(exp[2], env) / this.eval(exp[2], env);
    // }

    // -------------------------------------------
    // comparison operators:moved to be Gloabalfunctions
    // if (exp[0] === '>') {
    //   return this.eval(exp[1], env) > this.eval(exp[2], env);
    // }
    // if (exp[0] === '>=') {
    //   return this.eval(exp[1], env) >= this.eval(exp[2], env);
    // }
    // if (exp[0] === '<') {
    //   return this.eval(exp[1], env) < this.eval(exp[2], env);
    // }
    // if (exp[0] === '<=') {
    //   return this.eval(exp[1], env) <= this.eval(exp[2], env);
    // }
    // if (exp[0] === '=') {
    //   return this.eval(exp[1], env) == this.eval(exp[2], env);
    // }

    // -------------------------------------------
    // Math and comparison operators: (using native eval is slower)
    // if (['+', '-', '*', '/', '>', '>=', '<', '<=', '='].includes(exp[0])) {
    //   return applyOperator(
    //     exp[0],
    //     this.eval(exp[1], env),
    //     this.eval(exp[2], env)
    //   );
    // }

    // -------------------------------------------
    // Block: sequance of expressions

    if (exp[0] === 'begin') {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // -------------------------------------------
    // Variables decleration: (var foo 10)

    if (exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // -------------------------------------------
    // Variables update: (set foo 10)

    if (exp[0] === 'set') {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // -------------------------------------------
    // Variables access: foo

    if (this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    // -------------------------------------------
    // if-expression:

    if (exp[0] === 'if') {
      const [_, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    // -------------------------------------------
    // while-expression:

    if (exp[0] === 'while') {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    // -------------------------------------------
    // Function declaration: (def square (x) (* x x))
    // Syntactic sugar for: (var square (lambda (x) (* x x)))
    if (exp[0] === 'def') {
      // JIT-transpile to a variable declaration

      const varExp = this._transformer.transformDefToLambda(exp);

      return this.eval(varExp, env);
    }

    // -------------------------------------------
    // Switch-expression: (switch (cond1, block1) ...)
    //
    //Syntactic sugar for nested if-expressions
    if (exp[0] === 'switch') {
      const ifExp = this._transformer.transfromSwitchToIf(exp);

      
      return this.eval(ifExp, env);
    }

    // -------------------------------------------
    // For-loop: (for init condition modifier body)
    //
    //Syntactic sugar for: (begin init (while condition (begin body modifier)))
    if (exp[0] === 'for') {
      const whileExp = this._transformer.transformForToWhile(exp);

      return this.eval(whileExp, env);
    }


    // -------------------------------------------
    // Increment: (++ foo)
    // 
    // Syntactic sugar for: (set foo (+ foo 1))
    if (exp[0] === '++'){
      const setExp = this._transformer.transfromIncToSet(exp);

      return this.eval(setExp, env);
    }


    // -------------------------------------------
    // Deccrement: (-- foo)
    // 
    // Syntactic sugar for: (set foo (- foo 1))
    if (exp[0] === '--'){
      const setExp = this._transformer.transfromDecToSet(exp);

      return this.eval(setExp, env);
    }

    // -------------------------------------------
    // Increment: (+= foo)
    // 
    // Syntactic sugar for: (set foo (+ foo inc))
    if (exp[0] === '+='){
      const setExp = this._transformer.transfromIncValToSet(exp);

      return this.eval(setExp, env);
    }

    // -------------------------------------------
    // Decrement: (-= foo)
    // 
    // Syntactic sugar for: (set foo (- foo dec))
    if (exp[0] === '-='){
      const setExp = this._transformer.transfromDecValToSet(exp);

      return this.eval(setExp, env);
    }

    // -------------------------------------------
    // Lambda function: (lambda (x) (* x x))
    // Similar to "function" but without name

    if (exp[0] === 'lambda') {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env, //Clousre!
      };
    }

    // -------------------------------------------
    // Function calls:
    //
    // (print "Hello World")
    // (+ x 5)
    // (> foo bar)
    if (Array.isArray(exp)) {
      console.log('Exp at Array.isArray() ' + exp);
      const fn = this.eval(exp[0], env);

      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // 1. Native function:
      if (typeof fn === 'function') {
        return fn(...args);
      }
      // 2. User-defined funtions:

      const activationRecord = {};
      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(
        activationRecord,
        fn.env //static scope
      );

      return this._evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if (body[0] === 'begin') {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
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

  _isNumber(exp) {
    return typeof exp === 'number';
  }
  _isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
  }
  _isVariableName(exp) {
    return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
  }
}

// function applyOperator(operator, a, b) {
//   const exp = operator === '=' ? '==' : operator;
//   const expression = `${a} ${exp} ${b}`;
//   return eval(expression);
// }

/**
 * Default Global Environment.
 */
const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,

  VERSION: '1.0',

  //operators

  '+'(op1, op2) {
    return op1 + op2;
  },
  '-'(op1, op2 = null) {
    if (op2 == null) return -op1;
    return op1 - op2;
  },
  '*'(op1, op2) {
    console.log('Multiplication ' + op1 + ' * ' + op2);
    return op1 * op2;
  },
  '/'(op1, op2) {
    return op1 / op2;
  },
  '>'(op1, op2) {
    return op1 > op2;
  },
  '<'(op1, op2) {
    return op1 < op2;
  },
  '<='(op1, op2) {
    return op1 <= op2;
  },
  '>='(op1, op2) {
    return op1 >= op2;
  },
  '='(op1, op2) {
    return op1 === op2;
  },

  // Console output:

  print(...args) {
    console.log(...args);
  },
});

module.exports = Eva;
