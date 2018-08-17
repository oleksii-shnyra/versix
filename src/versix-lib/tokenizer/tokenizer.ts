import { TokenType } from '../interface';
import { Token } from "../interface";
import { allPrimitiveTokenizers } from './primitive-tokenizer';

export function tokenizer(input: string): Token[] {
    const tokens: Token[] = [];
    let current = 0;
    let lastTokenType: TokenType;
    input = `\n${input.trim()}\n`;
    while (current < input.length) {
        let tokenized = false;
        allPrimitiveTokenizers.forEach(tokenizer_fn => {
            if (tokenized) { return; }
            const { consumedChars, token } = tokenizer_fn(input, current);
            if (consumedChars !== 0) {
                tokenized = true;
                current += consumedChars;
            }
            if (token && (token.tokenType !== TokenType.newLine || lastTokenType !== TokenType.newLine)) {
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
