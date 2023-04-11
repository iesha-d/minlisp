// tokenizes a string into a list of its individual elements
function tokenize(str) {
    let modifiedString = "";
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) == "(") {
            modifiedString += " ( ";
        } else if (str.charAt(i) == ")") {
            modifiedString += " ) ";
        } else if (str.charAt(i) == "\n") {
            modifiedString += " ";
        } else {
            modifiedString += str.charAt(i);
        }
    }
    let unconsolidatedResult = modifiedString.split(" ");
    let result = [];
    for (let i = 0; i < unconsolidatedResult.length; i++) {
        if (unconsolidatedResult[i] == "\"" && unconsolidatedResult[i + 1] == "\"") {
            result.push("\" \"");
        } else {
            result.push(unconsolidatedResult[i]);
        }
    }
    result = result.filter((x) => x != "" && x != " ");
    return result;
}


// checks if 2 arbitrary JSON blobs of data are equal
function isEqual(a, b) {
    const jsonA = JSON.stringify(a);
    const jsonB = JSON.stringify(b);
    console.log(jsonA === jsonB);
    console.log("Expected: " + jsonB);
    console.log("     Got: " + jsonA);
}

// checks if a string is a number
function isNumber(str) {
    return /^[0-9]+$/.test(str);
}

// checks if a string is a char
function isChar(str) {
    return /^\"(.|\\.)\"$/.test(str);
}

// identifies and labels each token in a list
function tagTokens(tokenList) {
    let tokenTaggedList = [];
    for (let i = 0; i < tokenList.length; i++) {
        if (tokenList[i] == "(") {
            tokenTaggedList.push(["lp", "("]);
        } else if (tokenList[i] == ")") {
            tokenTaggedList.push(["rp", ")"]);
        } else if (tokenList[i] == "true" || tokenList[i] == "false") {
            tokenTaggedList.push(["bool", tokenList[i]]);
        } else if (isNumber(tokenList[i])) {
            tokenTaggedList.push(["num", tokenList[i]]);
        } else if (isChar(tokenList[i])) {
            tokenTaggedList.push(["char", tokenList[i]]);
        } else {
            tokenTaggedList.push(["id", tokenList[i]]);
        }
    }
    return tokenTaggedList;
}


class Stream {
    constructor(items, now = 0) {
        this.items = items;
        this.now = now;
    }

    peek(lookAhead = 0) {
        if ((this.now + lookAhead) >= this.items.length) {
            return null;
        } else {
            return this.items[this.now + lookAhead];
        }
    }

    done() {
        if (this.now >= this.items.length) {
            return true;
        } else {
            return false;
        }
    }

    consume(num = 1) {
        this.now += num;
    }
}


// parse any single item like a number, bool, char
// return null if the stream isn't looking at one of these
function parse_atom(stream) {
    if (stream.done()) return null;

    if (stream.peek()[0] == "lp" || stream.peek()[0] == "rp") {
        return null;
    } else {
        const elem = stream.peek();
        stream.consume();
        return {
            type: elem[0],
            atom: elem[1]
        };
    }
}


// Returns null if it didn't find a list
// Otherwise, returns list
function parse_list(stream) {
    let items = [];

    if (stream.peek()[0] == "lp") {
        const start = stream.now;
        stream.consume();

        while (!stream.done()) {
            if (stream.peek()[0] == "rp") {
                stream.consume();
                return {
                    type: "list",
                    items: items
                };
            } else {
                let maybe_atom = parse_atom(stream);
                if (maybe_atom !== null) {
                    items.push(maybe_atom);
                } else {
                    let maybe_list = parse_list(stream);
                    if (maybe_list !== null) {
                        items.push(maybe_list);
                    } else {
                        stream.now = start;
                        return null;
                    }
                }
            }
        }

        stream.now = start;
    }

    return null;
}


// This tries to match the stream against the definition for program
// If it succeeds, it returns the parsed content as a tree
// If it fails, it returns null
function parse_program(stream) {
    let lists = [];
    while (!stream.done()) {   
        let maybeList = parse_list(stream);
        
        if (maybeList === null) {
            return null;
        } else {
            lists.push(maybeList);
        }
    }
    return {
        type: "program",
        statements: lists
    };
}

function parse(minilispString) {
    let tokens = tokenize(minilispString);
    let tagged = tagTokens(tokens);
    let stream = new Stream(tagged);

    let result = parse_program(stream);
    return result;
}

const util = require('util');


class Evaluation {
    constructor(code) {
        this.symbols = new Map();

        this.parsedTree = parse(code);
    }

    run(astNode = null) {
        if (astNode == null) {
            astNode = this.parsedTree;
        }

        switch (astNode.type) {
            case 'program':
                for (let i = 0; i < astNode.statements.length; i++) {
                    let result = this.run(astNode.statements[i]);
                }
                break;

            case 'list':
                switch (astNode.items[0].atom) {
                    case '+':
                        return this.run(astNode.items[1]) + this.run(astNode.items[2]);

                    case '-':
                        return this.run(astNode.items[1]) - this.run(astNode.items[2]);

                    case '*':
                        return this.run(astNode.items[1]) * this.run(astNode.items[2]);

                    case '/':
                        return this.run(astNode.items[1]) / this.run(astNode.items[2]);

                    case '%':
                        return this.run(astNode.items[1]) % this.run(astNode.items[2]);

                    case 'set':
                        const idName = astNode.items[1].atom;
                        const valueToSet = this.run(astNode.items[2]);
                        this.symbols.set(idName, valueToSet);
                        break;

                    case 'read':
                        // BROKEN
                        this.symbols.set(astNode.items[1].atom, null);  
                        break;

                    case 'print':
                        console.log(this.run(astNode.items[1]));
                        break;

                    case '==':
                        return this.run(astNode.items[1]) == this.run(astNode.items[2]);

                    case '<':
                        return this.run(astNode.items[1]) < this.run(astNode.items[2]);

                    case '>':
                        return this.run(astNode.items[1]) > this.run(astNode.items[2]);

                    case 'if':
                        if (this.run(astNode.items[1])) {
                            return this.run(astNode.items[2]);
                        } else {
                            return this.run(astNode.items[3]);
                        }

                    case 'repeat':
                        const itemsLength = astNode.items.length;
                        for (let i = this.run(astNode.items[1]); i > 0; i--) {
                            for (let n = 2; n < itemsLength; n++) {
                                this.run(astNode.items[n]);
                            }
                        }
                        break;

                    default:
                        throw new Error("invalid astNode.items.type");
                }
                break;

            case 'id':
                if (this.symbols.has(astNode.atom)) {
                    return this.symbols.get(astNode.atom);
                } else {
                    throw new Error(`symbol ${astNode.atom} not found`);
                }

            case 'num':
                return parseFloat(astNode.atom);

            case 'char':
                return astNode.atom;

            case 'bool':
                return astNode.atom === "true";

            default:
                throw new Error("invalid astNode.type");
        }
    }
}

let x = new Evaluation("(set x 4) (set y (+ x 10)) (print y)");
console.log(x.run());

//  print # 1 to 10

let y = new Evaluation("(set i 1) (repeat 10 (print i) (set i (+ i 1)))");
console.log(y.run());

let z = new Evaluation(`
    (set n 100)
    (set i 1)
    (repeat n 
        (if (== (% n i) 0) (print i) 0)
        (set i (+ i 1))    
    )
`); 

console.log(z.run());

//  (set i 1) (while (< i 50) (print i) (set i (+ i 1)))
