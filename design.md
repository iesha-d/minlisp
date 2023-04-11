# Minilisp Design

## TYPES

In Minilisp, the data types are atoms and lists.

An atom is just a primitive value that can't be broken down
  into smaller bits. In Minilisp, we support numbers, characters,
  identifiers, and booleans.

A number is just an integer. 
They can be negative. If you divide two integers, you get an integer.
    -4   0   76

A character is a single letter surrounded by double quotes.
Special characters use a backslash followed by an escape code.
We only support \n (newline), \t (tab), and \" as escape codes.
    "a", " ", "\n", "\t", "\""
There is no "empty character". All characters are one letter.

A boolean is either true or false.

An identifier is the name of a variable or function.
Identifiers can contain and/or be made entirely of punctuation.
They just can't contain a double-quote.

A list is a sequence of other atoms and lists. For instance,
  () is the empty list, (1 2 3) is the list consisting of the three
  atoms 1, 2, and 3, and (() (1) (1 2) (1 2 3)) is the list consisting
  of the four lists inside it. 


## SEMANTICS

Programs are lists in the following format:
  (+ x (/ y 2))

  +, x, /, and y are identifiers
  2 is a number
  there are two lists

  (/ y 2) means, "Divide y by 2"
  (+ x (/ y 2)) means, "Add x to the result of dividing y by 2"

In general,

  (f)        means, call f()
  (f 1 2 3)  means, call f(1, 2, 3)

And all of the operators + - * / etc. are just functions.

List of functions to build into the language:

  (+ a b), (- a b), (* a b), (/ a b), (% a b)   the usual meaning
  (cmp a b)    the comparison operator; returns -1 if a < b, 0 if a == b,
               1 if a > b
  (and a b)  (or a b)  (not a b)   boolean ops
  (set ident val)       ident = val
  (print ___)           outputs it.

Then any program is just a list of these lists above.

  (set x 5)
  (set y 10)
  (print (+ x y))   // prints 15

