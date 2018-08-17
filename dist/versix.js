requirejs(["src/versix-lib/index"], function ({ versix }) {
    const span = document.querySelector('.version-date');
    span.innerText = versix.version;
    const textarea = document.querySelector('textarea');
    const button = document.querySelector('button');
    textarea.value = versix.default_program;
    button.onclick = () => {
        const tokens = versix.tokenizer(textarea.value);
        versix.helper.prettyLexLog(tokens);
        const ast = versix.parser(tokens);
        console.log('AST', JSON.stringify(ast, null, 2));
        versix.run(ast);
    };
});
define("src/versix-lib/interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TokenType;
    (function (TokenType) {
        TokenType["newLine"] = "newLine";
        TokenType["number"] = "number";
        TokenType["string"] = "string";
        TokenType["brack"] = "brack";
        TokenType["paren"] = "paren";
        TokenType["curly"] = "curly";
        TokenType["name"] = "name";
        TokenType["op"] = "op";
        TokenType["kw"] = "kw";
        TokenType["NumberLiteral"] = "NumberLiteral";
        TokenType["StringLiteral"] = "StringLiteral";
        TokenType["CallExpression"] = "CallExpression";
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
        DataType["vector1"] = "vector_1";
        DataType["vector2"] = "vector_2";
        DataType["vector3"] = "vector_3";
    })(DataType = exports.DataType || (exports.DataType = {}));
    var BuiltInFunc;
    (function (BuiltInFunc) {
        BuiltInFunc["v"] = "vector";
        BuiltInFunc["m"] = "matrix";
    })(BuiltInFunc = exports.BuiltInFunc || (exports.BuiltInFunc = {}));
    ;
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
define("src/versix-lib/tokenizer/sequence-token-map", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/data-structure/trie/trie"], function (require, exports, interface_1, trie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sequential = {};
    [
        ['[', interface_1.TokenType.brack],
        [']', interface_1.TokenType.brack],
        ['(', interface_1.TokenType.paren],
        [')', interface_1.TokenType.paren],
        ['{', interface_1.TokenType.curly],
        ['}', interface_1.TokenType.curly],
        ['=', interface_1.TokenType.op],
        ['+', interface_1.TokenType.op],
        ['-', interface_1.TokenType.op],
        ['*', interface_1.TokenType.op],
        ['**', interface_1.TokenType.op],
        ['^', interface_1.TokenType.op],
        ['T', interface_1.TokenType.op],
        ['const', interface_1.TokenType.kw],
        ['func', interface_1.TokenType.kw],
        ['log', interface_1.TokenType.kw],
    ].forEach(([key, type]) => {
        sequential[key] = {
            tokenType: type,
            value: key,
        };
    });
    exports.sequenceTokenTrie = new trie_1.Trie(sequential);
});
define("src/versix-lib/tokenizer/primitive-tokenizer", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/tokenizer/tokenizer-result", "src/versix-lib/tokenizer/sequence-token-map"], function (require, exports, interface_2, tokenizer_result_1, sequence_token_map_1) {
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
        const result = tokenizePattern(interface_2.TokenType.number, /[0-9\.]/, input, current);
        if (result.token) {
            result.token.value = Number(result.token.value);
        }
        return result;
    };
    const tokenizeName = (input, current) => tokenizePattern(interface_2.TokenType.name, /\b/i, input, current);
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
            return new tokenizer_result_1.TokenizerResult(consumedChars + 1, { tokenType: interface_2.TokenType.string, value });
        }
        return new tokenizer_result_1.TokenizerResult;
    };
    const tokenizeBuiltIn = (input, current) => (input[current] in interface_2.BuiltInFunc) ? new tokenizer_result_1.TokenizerResult(1, { tokenType: interface_2.TokenType.name, value: input[current] }) : new tokenizer_result_1.TokenizerResult;
    const tokenizeNewLine = (input, current) => (input[current] === '\n') ? new tokenizer_result_1.TokenizerResult(1, { tokenType: interface_2.TokenType.newLine }) : new tokenizer_result_1.TokenizerResult;
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
define("src/versix-lib/tokenizer/tokenizer", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/tokenizer/primitive-tokenizer"], function (require, exports, interface_3, primitive_tokenizer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function tokenizer(input) {
        const tokens = [];
        let current = 0;
        let lastTokenType;
        input = `\n${input.trim()}\n`;
        while (current < input.length) {
            let tokenized = false;
            primitive_tokenizer_1.allPrimitiveTokenizers.forEach(tokenizer_fn => {
                if (tokenized) {
                    return;
                }
                const { consumedChars, token } = tokenizer_fn(input, current);
                if (consumedChars !== 0) {
                    tokenized = true;
                    current += consumedChars;
                }
                if (token && (token.tokenType !== interface_3.TokenType.newLine || lastTokenType !== interface_3.TokenType.newLine)) {
                    tokens.push(token);
                    lastTokenType = token.tokenType;
                }
            });
            if (!tokenized) {
                throw new TypeError(`Unsupported character at ${current}: "${input[current]}"`);
            }
        }
        return tokens;
    }
    exports.tokenizer = tokenizer;
});
define("src/versix-lib/helper", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function prettyLexLog(tokens) {
        console.log(tokens.map(t => {
            if (t.tokenType === interface_4.TokenType.newLine) {
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
define("src/versix-lib/parser/parser", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const parseNumber = (tokens, current) => ({
        current: current + 1,
        node: {
            tokenType: interface_5.TokenType.NumberLiteral,
            value: tokens[current].value,
        }
    });
    const parseString = (tokens, current) => ({
        current: current + 1,
        node: {
            tokenType: interface_5.TokenType.StringLiteral,
            value: tokens[current].value,
        }
    });
    const parseToken = (tokens, current) => {
        const token = tokens[current];
        if (token) {
            if (token.tokenType === interface_5.TokenType.number) {
                return parseNumber(tokens, current);
            }
            if (token.tokenType === interface_5.TokenType.string) {
                return parseString(tokens, current);
            }
            if (token.tokenType === interface_5.TokenType.name) {
                return parseExpression(tokens, current);
            }
        }
        if (current < tokens.length) {
            return parseToken(tokens, current + 1);
        }
    };
    const parseExpression = (tokens, current) => {
        let token = tokens[current];
        const node = {
            tokenType: interface_5.TokenType.CallExpression,
            value: token.value,
            params: [],
        };
        token = tokens[++current];
        while (!(token.tokenType === interface_5.TokenType.newLine)) {
            const r = parseToken(tokens, current);
            if (!r) {
                break;
            }
            current = r.current;
            node.params.push(r.node);
            token = tokens[current];
        }
        current++;
        return { current, node };
    };
    function parser(tokens) {
        let current = 0;
        const ast = {
            type: 'Program',
            body: [],
        };
        let node = null;
        while (current < tokens.length) {
            const r = parseToken(tokens, current);
            if (!r) {
                break;
            }
            current = r.current;
            node = r.node;
            ast.body.push(node);
        }
        return ast;
    }
    exports.parser = parser;
});
define("src/versix-lib/runner/built-in-func", ["require", "exports", "src/versix-lib/interface"], function (require, exports, interface_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.builtInFuncs = {
        v(...args) {
            return Array.of(...args.map(t => {
                if (t.tokenType !== interface_6.TokenType.NumberLiteral) {
                    throw new Error(`argument for vector should be only number type`);
                }
                return t.value;
            }));
        }
    };
});
define("src/versix-lib/runner/runner", ["require", "exports", "src/versix-lib/interface", "src/versix-lib/runner/built-in-func"], function (require, exports, interface_7, built_in_func_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run(ast) {
        ast.body.forEach((t) => {
            if (t.tokenType === interface_7.TokenType.CallExpression) {
                if (built_in_func_1.builtInFuncs[t.value]) {
                    console.log(`execution result of "${t.value}":`, built_in_func_1.builtInFuncs[t.value](...t.params));
                }
                else {
                }
            }
        });
    }
    exports.run = run;
});
define("src/versix-lib/index", ["require", "exports", "src/versix-lib/tokenizer/tokenizer", "src/versix-lib/helper", "src/versix-lib/parser/parser", "src/versix-lib/runner/runner"], function (require, exports, tokenizer_1, helper_1, parser_1, runner_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const default_program = `const a = 600.501

v 1 4 6 9`;
    exports.versix = {
        helper: {
            prettyLexLog: helper_1.prettyLexLog,
        },
        tokenizer: tokenizer_1.tokenizer,
        parser: parser_1.parser,
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
    const ast = index_1.versix.parser(tokens);
    console.log('AST', JSON.stringify(ast, null, 2));
    index_1.versix.run(ast);
});
//# sourceMappingURL=versix.js.map