const assert = require('assert');

module.exports = (eva) => {
  // Math:
  assert.strictEqual(eva.eval(['+', 1, 5]), 6);
  assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
  assert.strictEqual(eva.eval(['-', 5, 4]), 1);
  assert.strictEqual(eva.eval(['-', ['-', 3, 2], 1]), 0);
  assert.strictEqual(eva.eval(['*', 2, 5]), 10);
  assert.strictEqual(eva.eval(['*', ['*', 2, 5], 2]), 20);
  assert.strictEqual(eva.eval(['/', 4, 2]), 2);
  assert.strictEqual(eva.eval(['/', ['/', 8, 2], 2]), 2);
};
