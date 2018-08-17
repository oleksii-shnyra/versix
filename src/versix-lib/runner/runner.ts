import { AstNode } from '../parser/interface';
import { Program, TokenType } from '../interface';
import { builtInFuncs } from './built-in-func';

export function run(ast: Program) {
    ast.body.forEach((t) => {
        if (t.tokenType === TokenType.CallExpression) {
            if (builtInFuncs[t.value]) {
                console.log(`execution result of "${t.value}":`, builtInFuncs[t.value](...t.params));
            } else {
                // throw new Error(`undefined name ${t.value}`);
            }
        }
    });
}