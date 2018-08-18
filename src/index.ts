// this file intended for nodejs execution

import { versix } from './versix-lib/index';

const tokens = versix.tokenizer(versix.default_program);
versix.helper.prettyLexLog(tokens);

const parser = new versix.Parser(tokens);
console.log('AST', JSON.stringify(parser.getAst(), null, 2));

versix.run(parser.getAst());