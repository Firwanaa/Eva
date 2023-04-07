/**
 * AST Transformer.
 */
class Transformer {
  /**
   * Translates `def` -expression (function declaration)
   * into a variable declaration with a lambda expression.
   */
  transformDefToLambda(defExp) {
    const [_tag, name, params, body] = defExp;
    return ['var', name, ['lambda', params, body]];
  }

  /**
   * Transforms `switch` to nested `if`-expression.
   */
  transfromSwitchToIf(switchExp) {
    const [_tag, ...cases] = switchExp;
    const ifExp = ['if', null, null, null];

    let current = ifExp;
    for (let i = 0; i < cases.length; i++) {
      const [currentCond, currentBlock] = cases[i];

      current[1] = currentCond;
      current[2] = currentBlock;

      const next = cases[i + 1];
      const [nextCond, nextBlock] = cases[i];

      current[3] = nextCond == 'else' ? nextBlock : ['if'];

      current = current[3];
    }

    return ifExp;
  }

  /**
   * Transforms `++` operator to an assignment.
   */
  transfromIncToSet(exp) {
    const [_tag, variable] = exp;
    return ['set', variable, ['+', variable, 1]];
  }
  /**
   * Transforms `++` operator to an assignment.
   */
  transfromDecToSet(exp) {
    const [_tag, variable] = exp;
    return ['set', variable, ['-', variable, 1]];
  }
  /**
   * Transforms `incval` to `set` expression.
   */
  transformIncValToSet(exp) {
    const [_tag, variable, value] = exp;
    return ['set', variable, ['+', variable, value]];
  }

  /**
   * Transforms `decval` to `set` expression.
   */
  transformDecValToSet(exp) {
    const [_tag, variable, value] = exp;
    return ['set', variable, ['-', variable, value]];
  }

  /**
   * Transforms `for`-loop to a `while`-loop.
   */
  transformForToWhile(exp) {
    const [_tag, init, condition, modifier, body] = exp;
    return ['begin', init, ['while', condition, ['begin', body, modifier]]];
  }
}
module.exports = Transformer;
