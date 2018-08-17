import { Token } from '../interface';
import { TokenType } from '../interface';
import { Trie } from '../data-structure/trie/trie';

const sequential: {
    [key: string]: Token
} = {};

[
    ['[', TokenType.brack],
    [']', TokenType.brack],
    ['(', TokenType.paren],
    [')', TokenType.paren],
    ['{', TokenType.curly],
    ['}', TokenType.curly],
    ['=', TokenType.op],
    ['+', TokenType.op],
    ['-', TokenType.op],
    ['*', TokenType.op],
    ['**', TokenType.op],
    ['^', TokenType.op],
    // transpose matrix
    ['T', TokenType.op],
    ['const', TokenType.kw],
    ['func', TokenType.kw],
    ['log', TokenType.kw],
].forEach(([key, type]: [string, TokenType]) => {
    sequential[key] = {
        tokenType: type,
        value: key,
    }
});

export const sequenceTokenTrie = new Trie<Token>(sequential);
