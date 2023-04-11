const assert = require('assert');
const evaParser = require('../parser/evaParser');

function test(eva, code, expected) {
  const exp = evaParser.parse(`(begin ${code})`);
  // console.log('code ' + code);
  // console.log('exp ' + exp);
  // console.log('eva.eval : ' + eva.eval(exp));
  assert.strictEqual(eva.evalGlobal(exp), expected);
}
module.exports = {
  test,
};
