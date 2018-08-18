import { Token, TokenType, DataType } from './../interface';
import { execToken } from './runner';

export const operatorMap = {
    '+': {
        func(a: Token, b: Token): Token {
            if (a.tokenType === TokenType.NumberLiteral && b.tokenType === TokenType.NumberLiteral) {
                return {
                    tokenType: TokenType.NumberLiteral,
                    value: <number>a.value + <number>b.value
                };
            } else {
                if (a.tokenType === TokenType.data && a.dataType === DataType.vector && b.tokenType === TokenType.NumberLiteral) {
                    return {
                        tokenType: TokenType.data,
                        dataType: DataType.vector,
                        value: (<number[]>a.value).map(e => e + b.value),
                    }
                }
            }
            throw new Error(`operator + received unprocessable operands ${JSON.stringify([a, b])}`);
        }
    }
}