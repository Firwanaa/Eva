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
    return  ['var', name, ['lambda', params, body]];
  }

  /**
   * Transforms `switch` to nested `if`-expression.
   */
  transfromSwitchToIf(switchExp) {
    const [_tag,...cases] = switchExp;
    const ifExp = ['if', null, null, null];

    let current = ifExp;
    for (let i = 0; i <cases.length; i++) {
        const [currentCond, currentBlock] = cases[i];
        
        current[1] = currentCond;
        current[2] = currentBlock;

        const next = cases[i + 1];
        const [nextCond, nextBlock] = cases[i];

        current[3] = nextCond == 'else'
            ? nextBlock
            : ['if'];

        current = current[3];
    }

    return ifExp;
  }


}
module.exports = Transformer;
