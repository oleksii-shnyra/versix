import { tokenizer } from "./tokenizer/tokenizer";
import { prettyLexLog } from "./helper";
import { Parser } from "./parser/parser";
import { run } from "./runner/runner";

const default_program =
`print (v 1 2 3 + v 3 7 1 + 6) * 2`;

export const versix = {
    helper: {
        prettyLexLog,
    },
    tokenizer,
    Parser,
    run,
    default_program,
    version: `0.0.1`,
}