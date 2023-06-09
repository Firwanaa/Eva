const assert = require('assert');
const { test } = require('./test-util');

module.exports = (eva) => {
  // Math functions:

  test(
    eva,
    `
    (begin
        (var x 10)
        (++ x)
        x    
    )
  
  `,
    11
  );
  test(
    eva,
    `
    (begin
        (var x 6)
        (-- x)
        x    
    )
  
  `,
    5
  );
  test(
    eva,
    `
    (begin
        (var result 0)
        (+= result 5)
        result    
    )
  
  `,
    5
  );
  test(
    eva,
    `
    (begin
        (var result 5)
        (-= result 2)
        result    
    )
  
  `,
    3
  );

  test(
    eva,
    `
      (begin
        (var result 0)
        (for (var i 0) (< i 5) (set i (+ i 1))
          (set result (+ result i)))
        result
      )
    `,
    10
  );
};
