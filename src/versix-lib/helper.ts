import { Token, TokenType } from "./interface";

export function prettyLexLog(tokens: Token[]) {
    console.log(tokens.map(t => {
        if (t.tokenType === TokenType.newLine) {
            return t.tokenType;
        }
        return rightSpaceFill(t.tokenType + ':', 21) + t.value;
    }).join('\n'));
}

function rightSpaceFill(s: string, width: number): string {
    return s + new Array(width - s.length).join(' ');
}
