import { DataType } from '../interface';
import { builtInFuncs } from '../runner/built-in-func';
import { TokenType } from "../interface";
import { TokenizerResult } from "./tokenizer-result";
import { sequenceTokenTrie } from "./sequence-token-map";

const tokenizePattern = (tokenType: TokenType, pattern, input, current): TokenizerResult => {
    let char = input[current];
    let consumedChars = 0;
    if (pattern.test(char)) {
        let value = '';
        while (char && pattern.test(char)) {
            value += char;
            consumedChars++;
            char = input[current + consumedChars];
        }
        return new TokenizerResult(consumedChars, { tokenType, value });
    }
    return new TokenizerResult;
};

const tokenizeNumber = (input: string, current: number): TokenizerResult => {
    const result = tokenizePattern(TokenType.data, /[0-9\.]/, input, current);
    if (result.token) {
        result.token.value = Number(result.token.value);
        result.token.dataType = DataType.number;
    }
    return result;
}

const tokenizeName = (input: string, current: number): TokenizerResult =>
    tokenizePattern(TokenType.name, /\b/i, input, current);

const tokenizeString = (input: string, current: number): TokenizerResult => {
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
        return new TokenizerResult(consumedChars + 1, {
            tokenType: TokenType.data,
            value,
            dataType: DataType.string,
        });
    }
    return new TokenizerResult;
};

const tokenizeBuiltIn = (input: string, current: number): TokenizerResult =>
    (input[current] in builtInFuncs) ? new TokenizerResult(1, { tokenType: TokenType.name, value: input[current] }) : new TokenizerResult;

const tokenizeNewLine = (input: string, current: number): TokenizerResult =>
    (input[current] === '\n') ? new TokenizerResult(1, { tokenType: TokenType.newLine }) : new TokenizerResult;

const tokenizeFromTrie = (input: string, current: number): TokenizerResult => {
    let char = input[current];
    let consumedChars = 0;
    let tokenWrap = sequenceTokenTrie.get(char);
    let nextTokenWrap = tokenWrap;
    if (tokenWrap) {
        let value = '';
        while (char) {
            nextTokenWrap = sequenceTokenTrie.get(value + char);
            if (!nextTokenWrap) {
                break;
            }
            value += char;
            consumedChars++;
            char = input[current + consumedChars];
            tokenWrap = nextTokenWrap;
        }
        return tokenWrap ?
            new TokenizerResult(consumedChars, tokenWrap.value) :
            new TokenizerResult;
    }
    return new TokenizerResult;
};

const skipWhiteSpace = (input: string, current: number): TokenizerResult => (/\s/.test(input[current])) ? new TokenizerResult(1) : new TokenizerResult;

export const allPrimitiveTokenizers = [
    tokenizeNewLine,
    skipWhiteSpace,
    tokenizeFromTrie,
    tokenizeBuiltIn,
    tokenizeString,
    tokenizeNumber,
    tokenizeName,
];