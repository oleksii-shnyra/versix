// this file intended for nodejs execution

import { versix } from './versix-lib/index';

const tokens = versix.tokenizer(versix.default_program);
versix.helper.prettyLexLog(tokens);

const ast = versix.parser(tokens);
console.log('AST', JSON.stringify(ast, null, 2));

versix.run(ast);