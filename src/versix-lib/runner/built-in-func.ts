import { TokenType } from '../interface';
import { Token, TokenNumber } from '../interface';

export const builtInFuncs = {
    v(...args: TokenNumber[]): number[] {
        return Array.of(...args.map(t => {
            if (t.tokenType !== TokenType.NumberLiteral) {
                throw new Error(`argument for vector should be only number type`);
            }
            return t.value;
        }));
    }
}