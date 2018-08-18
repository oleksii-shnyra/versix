import { tokenizer } from "./tokenizer/tokenizer";
import { prettyLexLog } from "./helper";
import { Parser } from "./parser/parser";
import { run } from "./runner/runner";

const default_program =
`v 1 0 1 + 9`;

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