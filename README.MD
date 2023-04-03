# Eva Language

Creating an interpreted programming language using JavaScript 🚀.


## Regular Expression Explanation

`/^ [+\-*/<>=a-zA-Z0-9_]+ $/`

- `^` - Matches the start of the string
- `[]` - Matches any character inside the brackets
- `+` - Matches one or more of the preceding character
- `$` - Matches the end of the string

`[+\-*/<>=a-zA-Z0-9_]`

This matches any character that is:
- `+` - a plus sign
- `-` - a minus sign
- `*` - an asterisk
- `/` - a forward slash
- `<` - a less than sign
- `>` - a greater than sign
- `=` - an equal sign
- `a-z` - any lowercase letter
- `A-Z` - any uppercase letter
- `0-9` - any digit
- `_` - an underscore

## Explanation of Code

This regular expression is used in the `_isVariableName` method to check if a string is a valid variable name. The method takes an expression as an argument and returns `true` if it is a valid variable name, and `false` otherwise.

The regular expression matches any string that consists of one or more of the characters listed above, and nothing else. If the expression is not a string, the method returns `false`.
