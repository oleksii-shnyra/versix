import { Token, AST, TokenType } from '../interface';
import { builtInFuncs } from './built-in-func';
import { operatorMap } from './operator-map';

export function run(ast: AST) {
    ast.forEach((t) => {
        execToken(t);
    });
}

export function execToken(t: Token): Token | void {
    switch (t.tokenType) {
        case TokenType.name:
            if (builtInFuncs[t.value]) {
                const result = builtInFuncs[t.value].func(...t.params.map(t => execToken(t)));
                if (t.value !== 'print') {
                    console.log(`execution result of "${t.value} ${t.params
                        .map(t => t.value)
                        .join(' ')}":`, result);
                }
                return result;
            } else {
                // throw new Error(`undefined name ${t.value}`);
            }
            break;
        case TokenType.op:
            if (operatorMap[t.value]) {
                const result = operatorMap[t.value].func(...t.params.map(t => execToken(t)));
                console.log(`operator result of "${t.value} ${t.params
                    .map(t => t.value)
                    .join(' ')}":`, result);
                return result;
            }
            break;
        case TokenType.CallExpression:
            return execToken(t.params[0]);
        default:
            return t;
    }
}