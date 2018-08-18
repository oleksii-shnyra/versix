import { Token } from "../interface";
import { allPrimitiveTokenizers } from './primitive-tokenizer';

export function tokenizer(input: string): Token[] {
    const tokens: Token[] = [];
    let current = 0;
    while (current < input.length) {
        let tokenized = false;
        allPrimitiveTokenizers.some(tokenizer_fn => {
            const { consumedChars, token } = tokenizer_fn(input, current);
            if (consumedChars !== 0) {
                tokenized = true;
                if (token) {
                    token.start = current;
                    token.end = current + consumedChars;
                    tokens.push(token);
                }
                current += consumedChars;
            }
            return tokenized;
        });
        if (!tokenized) {
            throw new TypeError(`Unsupported character at ${current}: "${input[current]}"`);
        }
    }
    return tokens;
}
