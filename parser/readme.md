## Lexical Grammar (tokens)
- The `%lex` directive specifies that the following section defines the lexical grammar or tokens of the parser.
- The `%%` separator divides the lexical grammar from the syntactic grammar.
- The first rule `"\s+"` skips whitespace characters, such as spaces and tabs.
- The second rule `\"[^\"]*\"` matches a string literal enclosed in double quotes, returning the token type `'STRING'`.
- The third rule `"\d+"` matches one or more digits, returning the token type `'NUMBER'`.
- The fourth rule `[\w\-+*=<>/]+` matches one or more characters that are either letters, digits, or any of the special characters `-`, `+`, `*`, `=`, `<`, `>`, and `/`. This rule matches symbols, returning the token type `'SYMBOL'`.

## Syntactic Grammar (BNF)
- The syntactic grammar starts after the `%%` separator.
- The `Exp` non-terminal symbol represents an expression. An expression can be an `Atom` or a `List`.
- The `Atom` non-terminal symbol represents an atomic value in the language. It can be a number (`NUMBER`), a string (`STRING`), or a symbol (`SYMBOL`).
- The `List` non-terminal symbol represents a list. It consists of a left parenthesis, a sequence of zero or more expressions separated by whitespace, and a right parenthesis.
- The `ListEntries` non-terminal symbol represents a sequence of zero or more expressions. It can be empty, represented by the empty rule `/* empty */`, or it can consist of a `ListEntries` followed by an `Exp`. The rule `$$ = $1` indicates that the value of the sequence is the value of the first rule.

## Usage
1. Install syntax-cli: `npm install -g syntax-cli`
2. Generate the parser from this grammar: `syntax-cli -g parser/eva-grammar.bnf -m LALR1 -o parser/evaParser.js`
3. Examples:
   - Atom: `42`, `foo`, `bar`, `"Hello World"`
   - List: `()`, `(+ 5 x)`, `(print "hello")`
