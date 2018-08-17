export enum TokenType {
    newLine = 'newLine',
    number = 'number',
    string = 'string',
    brack = 'brack',
    paren = 'paren',
    curly = 'curly',
    name = 'name',
    op = 'op',
    kw = 'kw',
    NumberLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    CallExpression = 'CallExpression',
}

export enum RefType {
    const = 'const',
    func = 'func',
}

export enum DataType {
    number = 'number',
    string = 'string',
    vector1 = 'vector_1',
    vector2 = 'vector_2',
    vector3 = 'vector_3',
}

export enum BuiltInFunc {
    v = 'vector',
    m = 'matrix',
}

export interface Token {
    tokenType: TokenType
    value?: string | number
    params?: any[]
    refType?: RefType
    dataType?: DataType
};

export interface TokenNumber extends Token {
    tokenType: TokenType.NumberLiteral
    value: number
}

export interface Program {
    type: 'Program'
    body: Token[]
}