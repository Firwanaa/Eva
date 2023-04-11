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
      const [_, ref, value] = exp;

      // Assign to a property:

      if (ref[0] === 'prop') {
        console.log({ref});
          const [_, instace, propName] = ref;
          const instaceEnv = this.eval(instace, env);
          return instaceEnv.define(
            propName,
            this.eval(value, env),
          );
      }

      // Simple assignment:

      return env.assign(ref, this.eval(value, env));
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
    if (exp[0] === '++') {
      const setExp = this._transformer.transfromIncToSet(exp);

      return this.eval(setExp, env);
    }

    // -------------------------------------------
    // Deccrement: (-- foo)
    //
    // Syntactic sugar for: (set foo (- foo 1))
    if (exp[0] === '--') {
      const setExp = this._transformer.transfromDecToSet(exp);

      return this.eval(setExp, env);
    }

    // -------------------------------------------
    // Increment: (+= foo inc)
    //
    // Syntactic sugar for: (set foo (+ foo inc))
    if (exp[0] === '+=') {
      const setExp = this._transformer.transformIncValToSet(exp);

      return this.eval(setExp, env);
    }

    // -------------------------------------------
    // Decrement: (-= foo)
    //
    // Syntactic sugar for: (set foo (- foo dec))
    if (exp[0] === '-=') {
      const setExp = this._transformer.transformDecValToSet(exp);

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
    // Class decleration: (class <Name> <Parent> <Body>)
    // class is just an Environment

    if (exp[0] === 'class') {
      const [_tag, name, parent, body] = exp;
      console.log('** class name', name);
      console.log('***class', exp);
      // A class is an environment! -- a storage methods,
      // and shared properties:

      const parentEnv = this.eval(parent, env) || env;

      const classEnv = new Environment({}, parentEnv);

      // Body is evaluated in the class environment

      this._evalBody(body, classEnv);

      // Class is accessible by name

      return env.define(name, classEnv);
    }

    // -------------------------------------------
    // Class instantiation: (new <Class> <Arguments>...)

    if (exp[0] === 'new') {
      const classEnv = this.eval(exp[1], env);

      // An instance of a class is an environment
      // The `parent` component of the instance environment
      // is set to its class.

      const instanceEnv = new Environment({}, classEnv);

      console.log('/**new */', instanceEnv);
      const args = exp.slice(2).map((arg) => this.eval(arg, env));

      this._callUserDefinedFunction(classEnv.lookup('constructor'), [
        instanceEnv,
        ...args,
      ]);
      return instanceEnv;
    }

    // -------------------------------------------
    // Property access: (prop <instance> <name>)

    if (exp[0] === 'prop') {
      const [_tag, instace, name] = exp;

      const instanceEnv = this.eval(instace, env);
      return instanceEnv.lookup(name);
    }

    // -------------------------------------------
    // Function calls:
    //
    // (print "Hello World")
    // (+ x 5)
    // (> foo bar)
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);

      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // 1. Native function:
      if (typeof fn === 'function') {
        return fn(...args);
      }
      // 2. User-defined funtions:

      return this._callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _callUserDefinedFunction(fn, args) {
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
