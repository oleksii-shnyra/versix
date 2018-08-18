import { Token, TokenType, DataType } from './../interface';

export const operatorMap = {
    '+': {
        func(a: Token, b: Token): Token {
            if (a.dataType === DataType.vector && b.dataType === DataType.vector) {
                if (a.value.length !== b.value.length) {
                    throw new Error('vectors should be of the same dimensions');
                }
                return {
                    tokenType: TokenType.data,
                    dataType: DataType.vector,
                    value: (<number[]>a.value).map((e, i) => e + b.value[i]),
                }
            } else if (b.tokenType !== TokenType.NumberLiteral) {
                [a, b] = [b, a];
            }
            if (b.tokenType === TokenType.NumberLiteral) {
                if (a.tokenType === TokenType.NumberLiteral && b.tokenType === TokenType.NumberLiteral) {
                    return {
                        tokenType: TokenType.NumberLiteral,
                        value: <number>a.value + <number>b.value
                    };
                } else if (a.dataType === DataType.vector) {
                    return {
                        tokenType: TokenType.data,
                        dataType: DataType.vector,
                        value: (<number[]>a.value).map(e => e + b.value),
                    }
                }
            }
            throw new Error(`operator + received unprocessable operands ${JSON.stringify([a, b])}`);
        }
    },
    '*': {
        func(a: Token, b: Token): Token {
            if (b.tokenType === TokenType.NumberLiteral) {
                if (a.tokenType === TokenType.NumberLiteral) {
                    return {
                        tokenType: TokenType.NumberLiteral,
                        value: <number>a.value * <number>b.value
                    };
                } else if (a.dataType === DataType.vector) {
                    return {
                        tokenType: TokenType.data,
                        dataType: DataType.vector,
                        value: (<number[]>a.value).map(e => e * b.value),
                    }
                }
                else if (a.tokenType === TokenType.StringLiteral) {
                    let value = '';
                    for (let i = 0; i < b.value; i++) {
                        value += a.value;
                    }
                    return {
                        tokenType: TokenType.StringLiteral,
                        value,
                    }
                }
            }
            throw new Error(`operator + received unprocessable operands ${JSON.stringify([a, b])}`);
        }
    }
}