requirejs(["src/versix-lib/index"], function ({ versix }) {
    const span = document.querySelector('.version-date');
    span.innerText = versix.version;
    const textarea = document.querySelector('textarea');
    const button = document.querySelector('button');
    textarea.value = versix.default_program;
    button.onclick = () => {
        const tokens = versix.tokenizer(textarea.value);
        versix.helper.prettyLexLog(tokens);
        const parser = new versix.Parser(tokens);
        console.log('AST', JSON.stringify(parser.getAst(), null, 2));
        versix.run(parser.getAst());
    };
});
define("src/versix-lib/interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    var TokenType;
    (function (TokenType) {
        TokenType["newLine"] = "newLine";
        TokenType["data"] = "data";
        TokenType["brac"] = "brac";
        TokenType["paren"] = "paren";
        TokenType["curly"] = "curly";
        TokenType["name"] = "name";
        TokenType["op"] = "op";
        TokenType["kw"] = "kw";
        TokenType["CallExpression"] = "CallExpression";
        TokenType["ExpressionStatement"] = "ExpressionStatement";
        TokenType["NumberLiteral"] = "NumberLiteral";
        TokenType["StringLiteral"] = "StringLiteral";
    })(TokenType = exports.TokenType || (exports.TokenType = {}));
    var RefType;
    (function (RefType) {
        RefType["const"] = "const";
        RefType["func"] = "func";
    })(RefType = exports.RefType || (exports.RefType = {}));
    var DataType;
    (function (DataType) {
        DataType["number"] = "number";
        DataType["string"] = "string";
        DataType["vector"] = "vector";
    })(DataType = exports.DataType || (exports.DataType = {}));
    class TokenNumber {
    }
    exports.TokenNumber = TokenNumber;
    class TokenVector {
    }
    exports.TokenVector = TokenVector;
    class TokenData {
        constructor(value) {
            this.value = value;
        }
    }
    exports.TokenData = TokenData;
});
define("src/versix-lib/runner/built-in-func", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let runningInBrowser;
    try {
        runningInBrowser = !!window;
    }
    catch (err) { }
    var ColoredConsole;
    (function (ColoredConsole) {
        ColoredConsole["Reset"] = "\u001B[0m";
        ColoredConsole["Bright"] = "\u001B[1m";
        ColoredConsole["Dim"] = "\u001B[2m";
        ColoredConsole["Underscore"] = "\u001B[4m";
        ColoredConsole["Blink"] = "\u001B[5m";
        ColoredConsole["Reverse"] = "\u001B[7m";
        ColoredConsole["Hidden"] = "\u001B[8m";
        ColoredConsole["FgBlack"] = "\u001B[30m";
        ColoredConsole["FgRed"] = "\u001B[31m";
        ColoredConsole["FgGreen"] = "\u001B[32m";
        ColoredConsole["FgYellow"] = "\u001B[33m";
        ColoredConsole["FgBlue"] = "\u001B[34m";
        ColoredConsole["FgMagenta"] = "\u001B[35m";
        ColoredConsole["FgCyan"] = "\u001B[36m";
        ColoredConsole["FgWhite"] = "\u001B[37m";
        ColoredConsole["BgBlack"] = "\u001B[40m";
        ColoredConsole["BgRed"] = "\u001B[41m";
        ColoredConsole["BgGreen"] = "\u001B[42m";
        ColoredConsole["BgYellow"] = "\u001B[43m";
        ColoredConsole["BgBlue"] = "\u001B[44m";
        ColoredConsole["BgMagenta"] = "\u001B[45m";
        ColoredConsole["BgCyan"] = "\u001B[46m";
        ColoredConsole["BgWhite"] = "\u001B[47m";
    })(ColoredConsole || (ColoredConsole = {}));
    const prettyArgument = (args) => {
        if (args.length === 1) {
            const [o] = args;
            return [{
                    type: o.dataType === interface_1.DataType.vector ? `vector ${o.value.length}` : o.tokenType,
                    o,
                }, o.value];
        }
        else {
            return args;
        }
    };
    exports.builtInFuncs = {
        print: {
            func(...args) {
                if (runningInBrowser) {
                    console.log(`%cprint ==>`, 'color: green', ...prettyArgument(args));
                }
                else {
                    console.log(`${ColoredConsole.FgGreen}print ==>`, ...prettyArgument(args));
                }
            },
        },
        v: {
            returnType: interface_1.TokenType.data,
            returnData: interface_1.DataType.vector,
            func(...args) {
                return {
                    tokenType: interface_1.TokenType.data,
                    dataType: interface_1.DataType.vector,
                    value: Array.of(...args.map(t => {
                        if (t.tokenType !== interface_1.TokenType.NumberLiteral) {
                            throw new Error(`argument for vector should be only number type`);
                        }
                        return t.value;
                    })),
                };
            },
        }
    };
});
define("src/versix-lib/tokenizer/tokenizer-result", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TokenizerResult {
        constructor(consumedChars = 0, token = null) {
            this.consumedChars = consumedChars;
            this.token = token;
        }
    }
    exports.TokenizerResult = TokenizerResult;
});
define("src/versix-lib/data-structure/trie/interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/versix-lib/data-structure/trie/trie", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Trie {
        constructor(map) {
            this.nodes = {};
            this.buildTrieFromMap(map);
        }
        buildTrieFromMap(map) {
            Object.keys(map).forEach(key => {
                let consumed = 0;
                let curNode;
                for (const c of key) {
                    consumed++;
                    if (!curNode) {
                        if (!this.nodes[c]) {
                            this.nodes[c] = {
                                children: {},
                            };
                        }
                        curNode = this.nodes[c];
                    }
                    if (consumed > 1) {
                        if (!curNode.children[c]) {
                            curNode.children[c] = {
                                children: {},
                            };
                        }
                        curNode = curNode.children[c];
                    }
                    if (consumed === key.length) {
                        curNode.value = map[key];
                    }
                }
            });
        }
        get(path) {
            let curNode;
            let consumed = 0;
            for (const c of path) {
                consumed++;
                if (consumed > 1) {
                    if (!curNode || !curNode.children[c]) {
                        return false;
                    }
                    else {
                        curNode = curNode.children[c];
                    }
                }
                else {
                    if (!this.nodes[c]) {
                        return false;
                    }
                    curNode = this.nodes[c];
                }
            }
            return curNode ? { value: curNode.value } : false;
        }
        getFullTrie() {
            return this.nodes;
        }
    }
    exports.Trie = Trie;
});
define("src/versix-lib/tokenizer/sequence-token-map", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/data-structure/trie/trie"], function (require, exports, interface_2, trie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sequential = {};
    [
        ['[', interface_2.TokenType.brac],
        [']', interface_2.TokenType.brac],
        ['(', interface_2.TokenType.paren],
        [')', interface_2.TokenType.paren],
        ['{', interface_2.TokenType.curly],
        ['}', interface_2.TokenType.curly],
        ['=', interface_2.TokenType.op],
        ['+', interface_2.TokenType.op],
        ['-', interface_2.TokenType.op],
        ['*', interface_2.TokenType.op],
        ['**', interface_2.TokenType.op],
        ['^', interface_2.TokenType.op],
        ['T', interface_2.TokenType.op],
        ['const', interface_2.TokenType.kw],
        ['func', interface_2.TokenType.kw],
        ['log', interface_2.TokenType.kw],
    ].forEach(([key, type]) => {
        sequential[key] = {
            tokenType: type,
            value: key,
        };
    });
    exports.sequenceTokenTrie = new trie_1.Trie(sequential);
});
define("src/versix-lib/tokenizer/primitive-tokenizer", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/runner/built-in-func", "src/versix-lib/interface", "src/versix-lib/tokenizer/tokenizer-result", "src/versix-lib/tokenizer/sequence-token-map"], function (require, exports, interface_3, built_in_func_1, interface_4, tokenizer_result_1, sequence_token_map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tokenizePattern = (tokenType, pattern, input, current) => {
        let char = input[current];
        let consumedChars = 0;
        if (pattern.test(char)) {
            let value = '';
            while (char && pattern.test(char)) {
                value += char;
                consumedChars++;
                char = input[current + consumedChars];
            }
            return new tokenizer_result_1.TokenizerResult(consumedChars, { tokenType, value });
        }
        return new tokenizer_result_1.TokenizerResult;
    };
    const tokenizeNumber = (input, current) => {
        const result = tokenizePattern(interface_4.TokenType.data, /[0-9\.]/, input, current);
        if (result.token) {
            result.token.value = Number(result.token.value);
            result.token.dataType = interface_3.DataType.number;
        }
        return result;
    };
    const tokenizeName = (input, current) => tokenizePattern(interface_4.TokenType.name, /\b/i, input, current);
    const tokenizeString = (input, current) => {
        if (input[current] === `'`) {
            let value = '';
            let consumedChars = 1;
            let char = input[current + consumedChars];
            while (char !== `'`) {
                if (char === undefined) {
                    throw new TypeError('unterminated string');
                }
                value += char;
                consumedChars++;
                char = input[current + consumedChars];
            }
            return new tokenizer_result_1.TokenizerResult(consumedChars + 1, {
                tokenType: interface_4.TokenType.data,
                value,
                dataType: interface_3.DataType.string,
            });
        }
        return new tokenizer_result_1.TokenizerResult;
    };
    const tokenizeBuiltIn = (input, current) => (input[current] in built_in_func_1.builtInFuncs) ? new tokenizer_result_1.TokenizerResult(1, { tokenType: interface_4.TokenType.name, value: input[current] }) : new tokenizer_result_1.TokenizerResult;
    const tokenizeNewLine = (input, current) => (input[current] === '\n') ? new tokenizer_result_1.TokenizerResult(1, { tokenType: interface_4.TokenType.newLine }) : new tokenizer_result_1.TokenizerResult;
    const tokenizeFromTrie = (input, current) => {
        let char = input[current];
        let consumedChars = 0;
        let tokenWrap = sequence_token_map_1.sequenceTokenTrie.get(char);
        let nextTokenWrap = tokenWrap;
        if (tokenWrap) {
            let value = '';
            while (char) {
                nextTokenWrap = sequence_token_map_1.sequenceTokenTrie.get(value + char);
                if (!nextTokenWrap) {
                    break;
                }
                value += char;
                consumedChars++;
                char = input[current + consumedChars];
                tokenWrap = nextTokenWrap;
            }
            return tokenWrap ?
                new tokenizer_result_1.TokenizerResult(consumedChars, tokenWrap.value) :
                new tokenizer_result_1.TokenizerResult;
        }
        return new tokenizer_result_1.TokenizerResult;
    };
    const skipWhiteSpace = (input, current) => (/\s/.test(input[current])) ? new tokenizer_result_1.TokenizerResult(1) : new tokenizer_result_1.TokenizerResult;
    exports.allPrimitiveTokenizers = [
        tokenizeNewLine,
        skipWhiteSpace,
        tokenizeFromTrie,
        tokenizeBuiltIn,
        tokenizeString,
        tokenizeNumber,
        tokenizeName,
    ];
});
define("src/versix-lib/tokenizer/tokenizer", ["require", "exports", "src/versix-lib/tokenizer/primitive-tokenizer"], function (require, exports, primitive_tokenizer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function tokenizer(input) {
        const tokens = [];
        let current = 0;
        while (current < input.length) {
            let tokenized = false;
            primitive_tokenizer_1.allPrimitiveTokenizers.some(tokenizer_fn => {
                const { consumedChars, token } = tokenizer_fn(input, current);
                if (consumedChars !== 0) {
                    tokenized = true;
                    if (token) {
                        token.start = current;
                        token.end = current + consumedChars;
                        tokens.push(token);
                    }
                    current += consumedChars;
                }
                return tokenized;
            });
            if (!tokenized) {
                throw new TypeError(`Unsupported character at ${current}: "${input[current]}"`);
            }
        }
        return tokens;
    }
    exports.tokenizer = tokenizer;
});
define("src/versix-lib/helper", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function prettyLexLog(tokens) {
        console.log(tokens.map(t => {
            if (t.tokenType === interface_5.TokenType.newLine) {
                return t.tokenType;
            }
            return rightSpaceFill(t.tokenType + ':', 21) + t.value;
        }).join('\n'));
    }
    exports.prettyLexLog = prettyLexLog;
    function rightSpaceFill(s, width) {
        return s + new Array(width - s.length).join(' ');
    }
});
define("src/versix-lib/parser/interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/versix-lib/parser/parser", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Parser {
        constructor(tokens) {
            this.tokens = tokens;
            this.ast = [];
            this.current = 0;
            this.parse();
        }
        parse() {
            while (this.current < this.tokens.length) {
                const r = this.parseToken(this.tokens, this.current, this.ast);
                if (!r) {
                    this.current++;
                    continue;
                }
                this.current = r.current;
                this.ast.push(r.node);
            }
        }
        getAst() {
            return this.ast;
        }
        parseNumber(tokens, current) {
            return {
                current: current + 1,
                node: {
                    tokenType: interface_6.TokenType.NumberLiteral,
                    value: tokens[current].value,
                    start: tokens[current].start,
                    end: tokens[current].end,
                }
            };
        }
        parseString(tokens, current) {
            return {
                current: current + 1,
                node: {
                    tokenType: interface_6.TokenType.StringLiteral,
                    value: tokens[current].value,
                    start: tokens[current].start,
                    end: tokens[current].end,
                }
            };
        }
        parseToken(tokens, current, paramsArr) {
            const token = tokens[current];
            if (token) {
                if (token.tokenType === interface_6.TokenType.newLine) {
                    return;
                }
                switch (token.tokenType) {
                    case interface_6.TokenType.data:
                        switch (token.dataType) {
                            case interface_6.DataType.number: return this.parseNumber(tokens, current);
                            case interface_6.DataType.string: return this.parseString(tokens, current);
                        }
                    case interface_6.TokenType.paren:
                        if (token.value === '(') {
                            return this.parseExpression(tokens, current);
                        }
                        return;
                    case interface_6.TokenType.name:
                        if (token.value === 'print') {
                            return this.parseEol(tokens, current);
                        }
                        return this.parseName(tokens, current);
                    case interface_6.TokenType.op: return this.parseOperator(tokens, current, paramsArr);
                }
            }
            if (current < tokens.length) {
                return this.parseToken(tokens, current + 1, paramsArr);
            }
        }
        getNodeFromToken(tokens, current) {
            const token = tokens[current];
            return {
                tokenType: token.tokenType,
                value: token.value,
                start: token.start,
                end: token.end,
                params: [],
            };
        }
        parseEol(tokens, current) {
            const node = this.getNodeFromToken(tokens, current);
            let token = tokens[++current];
            while (token && token.tokenType !== interface_6.TokenType.newLine) {
                const r = this.parseToken(tokens, current, node.params);
                if (!r) {
                    break;
                }
                current = r.current;
                token = tokens[current];
                node.params.push(r.node);
            }
            return { current, node };
        }
        parseExpression(tokens, current) {
            const node = this.getNodeFromToken(tokens, current);
            node.tokenType = interface_6.TokenType.CallExpression;
            let token = tokens[++current];
            while (token && token.tokenType !== interface_6.TokenType.paren && token.value !== ')') {
                const r = this.parseToken(tokens, current, node.params);
                if (!r) {
                    break;
                }
                current = r.current;
                token = tokens[current];
                node.params.push(r.node);
            }
            current++;
            return { current, node };
        }
        parseName(tokens, current) {
            const node = this.getNodeFromToken(tokens, current);
            let token = tokens[++current];
            while (token && token.tokenType !== interface_6.TokenType.op) {
                const r = this.parseToken(tokens, current, node.params);
                if (!r) {
                    break;
                }
                current = r.current;
                token = tokens[current];
                node.params.push(r.node);
            }
            return { current, node };
        }
        parseOperator(tokens, current, paramsArr) {
            const node = this.getNodeFromToken(tokens, current);
            let token = tokens[++current];
            while (token && token.tokenType !== interface_6.TokenType.op) {
                const r = this.parseToken(tokens, current, node.params);
                if (!r) {
                    break;
                }
                current = r.current;
                token = tokens[current];
                node.params.push(r.node);
            }
            if (paramsArr.length) {
                node.params.unshift(paramsArr.pop());
            }
            return { current, node };
        }
    }
    exports.Parser = Parser;
});
define("src/versix-lib/runner/operator-map", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.operatorMap = {
        '+': {
            func(a, b) {
                if (a.dataType === interface_7.DataType.vector && b.dataType === interface_7.DataType.vector) {
                    if (a.value.length !== b.value.length) {
                        throw new Error('vectors should be of the same dimensions');
                    }
                    return {
                        tokenType: interface_7.TokenType.data,
                        dataType: interface_7.DataType.vector,
                        value: a.value.map((e, i) => e + b.value[i]),
                    };
                }
                else if (b.tokenType !== interface_7.TokenType.NumberLiteral) {
                    [a, b] = [b, a];
                }
                if (b.tokenType === interface_7.TokenType.NumberLiteral) {
                    if (a.tokenType === interface_7.TokenType.NumberLiteral && b.tokenType === interface_7.TokenType.NumberLiteral) {
                        return {
                            tokenType: interface_7.TokenType.NumberLiteral,
                            value: a.value + b.value
                        };
                    }
                    else if (a.dataType === interface_7.DataType.vector) {
                        return {
                            tokenType: interface_7.TokenType.data,
                            dataType: interface_7.DataType.vector,
                            value: a.value.map(e => e + b.value),
                        };
                    }
                }
                throw new Error(`operator + received unprocessable operands ${JSON.stringify([a, b])}`);
            }
        },
        '*': {
            func(a, b) {
                if (b.tokenType === interface_7.TokenType.NumberLiteral) {
                    if (a.tokenType === interface_7.TokenType.NumberLiteral) {
                        return {
                            tokenType: interface_7.TokenType.NumberLiteral,
                            value: a.value * b.value
                        };
                    }
                    else if (a.dataType === interface_7.DataType.vector) {
                        return {
                            tokenType: interface_7.TokenType.data,
                            dataType: interface_7.DataType.vector,
                            value: a.value.map(e => e * b.value),
                        };
                    }
                    else if (a.tokenType === interface_7.TokenType.StringLiteral) {
                        let value = '';
                        for (let i = 0; i < b.value; i++) {
                            value += a.value;
                        }
                        return {
                            tokenType: interface_7.TokenType.StringLiteral,
                            value,
                        };
                    }
                }
                throw new Error(`operator + received unprocessable operands ${JSON.stringify([a, b])}`);
            }
        }
    };
});
define("src/versix-lib/runner/runner", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/runner/built-in-func", "src/versix-lib/runner/operator-map"], function (require, exports, interface_8, built_in_func_2, operator_map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run(ast) {
        ast.forEach((t) => {
            execToken(t);
        });
    }
    exports.run = run;
    function execToken(t) {
        switch (t.tokenType) {
            case interface_8.TokenType.name:
                if (built_in_func_2.builtInFuncs[t.value]) {
                    const result = built_in_func_2.builtInFuncs[t.value].func(...t.params.map(t => execToken(t)));
                    if (t.value !== 'print') {
                        console.log(`execution result of "${t.value} ${t.params
                            .map(t => t.value)
                            .join(' ')}":`, result);
                    }
                    return result;
                }
                else {
                }
                break;
            case interface_8.TokenType.op:
                if (operator_map_1.operatorMap[t.value]) {
                    const result = operator_map_1.operatorMap[t.value].func(...t.params.map(t => execToken(t)));
                    console.log(`operator result of "${t.value} ${t.params
                        .map(t => t.value)
                        .join(' ')}":`, result);
                    return result;
                }
                break;
            case interface_8.TokenType.CallExpression:
                return execToken(t.params[0]);
            default:
                return t;
        }
    }
    exports.execToken = execToken;
});
define("src/versix-lib/index", ["require", "exports", "src/versix-lib/tokenizer/tokenizer", "src/versix-lib/helper", "src/versix-lib/parser/parser", "src/versix-lib/runner/runner"], function (require, exports, tokenizer_1, helper_1, parser_1, runner_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const default_program = `print (v 1 2 3 + v 3 7 1 + 6) * 2`;
    exports.versix = {
        helper: {
            prettyLexLog: helper_1.prettyLexLog,
        },
        tokenizer: tokenizer_1.tokenizer,
        Parser: parser_1.Parser,
        run: runner_1.run,
        default_program,
        version: `0.0.1`,
    };
});
define("src/index", ["require", "exports", "src/versix-lib/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tokens = index_1.versix.tokenizer(index_1.versix.default_program);
    index_1.versix.helper.prettyLexLog(tokens);
    const parser = new index_1.versix.Parser(tokens);
    console.log('AST', JSON.stringify(parser.getAst(), null, 2));
    index_1.versix.run(parser.getAst());
});
//# sourceMappingURL=versix.js.map