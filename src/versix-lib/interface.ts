export interface Token {
    tokenType: TokenType
    value?: any
    params?: Token[]
    refType?: RefType
    dataType?: DataType
    start?: number
    end?: number
    expression?: Token
};

export enum TokenType {
    newLine = 'newLine',
    data = 'data',
    brac = 'brac',
    paren = 'paren',
    curly = 'curly',
    name = 'name',
    op = 'op',
    kw = 'kw',
    ExpressionStatement = 'ExpressionStatement',
    NumberLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
}

export enum RefType {
    const = 'const',
    func = 'func',
}

export enum DataType {
    number = 'number',
    string = 'string',
    vector = 'vector',
    vector1 = 'vector_1',
    vector2 = 'vector_2',
    vector3 = 'vector_3',
}

export class TokenNumber implements Token {
    tokenType: TokenType.NumberLiteral
    value: number
}

export class TokenVector implements Token {
    tokenType: TokenType.data
    dataType: DataType.vector
    value: number[]
}

export class TokenData implements Token {
    tokenType: TokenType.data
    dataType: DataType
    constructor(public value: any) {}
}

export type AST = Token[]
