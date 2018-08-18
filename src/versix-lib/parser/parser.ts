import { TokenType, AST, DataType } from '../interface';
import { Token } from '../interface';
import { AstNode } from "./interface";

export class Parser {
    private ast: AST = [];
    private current = 0;

    constructor(public tokens: Token[]) {
        this.parse();
    }

    public parse() {
        while (this.current < this.tokens.length) {
            const r = this.parseToken(this.tokens, this.current, this.ast);
            if (!r) {
                break;
            }
            this.current = r.current;
            this.ast.push(r.node);
        }
    }

    public getAst(): AST {
        return this.ast;
    }

    public parseNumber(tokens: Token[], current: number): AstNode {
        return {
            current: current + 1,
            node: {
                tokenType: TokenType.NumberLiteral,
                value: tokens[current].value,
                start: tokens[current].start,
                end: tokens[current].end,
            }
        }
    }

    public parseString(tokens: Token[], current: number): AstNode {
        return {
            current: current + 1,
            node: {
                tokenType: TokenType.StringLiteral,
                value: tokens[current].value,
                start: tokens[current].start,
                end: tokens[current].end,
            }
        }
    }

    public parseToken(tokens: Token[], current: number, paramsArr: Token[]): AstNode | void {
        const token = tokens[current];
        if (token) {
            if (token.tokenType === TokenType.newLine) {
                return this.parseToken(tokens, current + 1, paramsArr);
            }
            switch (token.tokenType) {
                case TokenType.data:
                    switch (token.dataType) {
                        case DataType.number: return this.parseNumber(tokens, current);
                        case DataType.string: return this.parseString(tokens, current);
                    }
                case TokenType.name: return this.parseName(tokens, current, paramsArr);
                case TokenType.op: return this.parseOperator(tokens, current, paramsArr);
            }
            // if (token.tokenType === TokenType.paren && token.value === '(') {
            //     return parseExpression(tokens, current);
            // }
            // throw new TypeError(token.tokenType);
        }
        if (current < tokens.length) {
            return this.parseToken(tokens, current + 1, paramsArr);
        }
    }

    public getNodeFromToken(tokens: Token[], current: number): Token {
        const token = tokens[current];
        return {
            tokenType: token.tokenType,
            value: token.value,
            start: token.start,
            end: token.end,
            params: [],
        };
    }

    public parseName(tokens: Token[], current: number, paramsArr: Token[]): AstNode | void {
        const node = this.getNodeFromToken(tokens, current);
        let token = tokens[++current];
        while (token && token.tokenType !== TokenType.op) {
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

    public parseOperator(tokens: Token[], current: number, paramsArr: Token[]): AstNode | void {
        const node = this.getNodeFromToken(tokens, current);
        let token = tokens[++current];
        while (token && token.tokenType !== TokenType.op) {
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
