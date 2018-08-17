import { tokenizer } from "./tokenizer/tokenizer";
import { prettyLexLog } from "./helper";
import { parser } from "./parser/parser";
import { run } from "./runner/runner";

const default_program =
`const a = 600.501

v 1 4 6 9`;

export const versix = {
    helper: {
        prettyLexLog,
    },
    tokenizer,
    parser,
    run,
    default_program,
    version: `0.0.1`,
}