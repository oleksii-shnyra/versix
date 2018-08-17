import { TokenType, Program } from '../interface';
import { Token } from '../interface';
import { AstNode } from "./interface";

const parseNumber = (tokens: Token[], current: number): AstNode => ({
    current: current + 1,
    node: {
        tokenType: TokenType.NumberLiteral,
        value: tokens[current].value,
    }
});

const parseString = (tokens: Token[], current: number): AstNode => ({
    current: current + 1,
    node: {
        tokenType: TokenType.StringLiteral,
        value: tokens[current].value,
    }
});

const parseToken = (tokens: Token[], current: number): AstNode | void => {
    const token = tokens[current];
    if (token) {
        if (token.tokenType === TokenType.number) {
            return parseNumber(tokens, current);
        }
        if (token.tokenType === TokenType.string) {
            return parseString(tokens, current);
        }
        if (token.tokenType === TokenType.name) {
            return parseExpression(tokens, current);
        }
        // if (token.tokenType === TokenType.paren && token.value === '(') {
        //     return parseExpression(tokens, current);
        // }
        // TODO uncomment this line
        // throw new TypeError(token.tokenType);
    }
    if (current < tokens.length) {
        return parseToken(tokens, current + 1);
    }
}

const parseExpression = (tokens: Token[], current: number): AstNode => {
    let token = tokens[current];
    const node = {
        tokenType: TokenType.CallExpression,
        value: token.value,
        params: [],
    };
    token = tokens[++current];
    while (!(token.tokenType === TokenType.newLine)) {
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
}

export function parser(tokens: Token[]): Program {
    let current = 0;
    const ast = {
        type: 'Program' as 'Program',
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
