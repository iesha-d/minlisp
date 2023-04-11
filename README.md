# Minilisp

This repo houses Minilisp, a simple Lisp-like language, and a parser, which represents it as a JS object.

I created Minilisp and its parser to investigate programming languages and become more comfortable with JS. It provides a basic understanding of Lisp-style languages and can be used to experiment with Lisp's unique syntax and approach to computation. The interpreter is capable of performing arithmetic operations, managing variables, and implementing control structures such as loops and conditionals.

## Features

- Tokenization: Converts a string of MiniLisp code into a list of individual elements (tokens).
- Parsing: Constructs an abstract syntax tree (AST) from a list of tokens.
- Evaluation: Evaluates the parsed MiniLisp code, executing the specified operations and control structures.

## Language Syntax

The MiniLisp language supports the following basic syntax and operations:

- Arithmetic operations: +, -, *, /, %
- Variables: set
- Comparison: ==, <, >
- Conditionals: if
- Loops: repeat
- Input/output: print

## Usage

To use the MiniLisp interpreter, create a new instance of the Evaluation class, passing the MiniLisp code as a string. Then, call the run method on the instance to execute the code.

```javascript
let code = new Evaluation("(set x 4) (set y (+ x 10)) (print y)");
console.log(code.run());
```

Examples

Here are a few example programs to illustrate the use of the MiniLisp interpreter:

    Initialize two variables and print their sum:

```javascript
let example1 = new Evaluation("(set x 4) (set y (+ x 10)) (print y)");
console.log(example1.run());
```

    Print numbers 1 to 10:


```javascript
let example2 = new Evaluation("(set i 1) (repeat 10 (print i) (set i (+ i 1)))");
console.log(example2.run());
```
    Print the divisors of a given number:

```javascript

let example3 = new Evaluation(`
    (set n 100)
    (set i 1)
    (repeat n 
        (if (== (% n i) 0) (print i) 0)
        (set i (+ i 1))    
    )
`);
console.log(example3.run());
```
