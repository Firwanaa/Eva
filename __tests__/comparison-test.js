const assert = require('assert');

module.exports = (eva) => {
  // Comparison operators:
  assert.strictEqual(eva.eval(['>', 5, 1]), true);
  assert.strictEqual(eva.eval(['>', 1, 5]), false);
  assert.strictEqual(eva.eval(['>=', 5, 5]), true);
  assert.strictEqual(eva.eval(['>=', 6, 5]), true);
  assert.strictEqual(eva.eval(['<=', 6, 6]), true);
  assert.strictEqual(eva.eval(['<=', 5, 6]), true);
  assert.strictEqual(eva.eval(['<', 1, 5]), true);
  assert.strictEqual(eva.eval(['<', 5, 1]), false);
  assert.strictEqual(eva.eval(['=', 5, 5]), true);
  assert.strictEqual(eva.eval(['=', 1, 5]), false);
};
