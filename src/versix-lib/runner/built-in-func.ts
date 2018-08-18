import { DataType, TokenType, Token, TokenNumber, TokenVector } from '../interface';

let runningInBrowser;

try {
    runningInBrowser = !!window;
} catch (err) { }

enum ColoredConsole {
    Reset = '\x1b[0m',
    Bright = '\x1b[1m',
    Dim = '\x1b[2m',
    Underscore = '\x1b[4m',
    Blink = '\x1b[5m',
    Reverse = '\x1b[7m',
    Hidden = '\x1b[8m',

    FgBlack = '\x1b[30m',
    FgRed = '\x1b[31m',
    FgGreen = '\x1b[32m',
    FgYellow = '\x1b[33m',
    FgBlue = '\x1b[34m',
    FgMagenta = '\x1b[35m',
    FgCyan = '\x1b[36m',
    FgWhite = '\x1b[37m',

    BgBlack = '\x1b[40m',
    BgRed = '\x1b[41m',
    BgGreen = '\x1b[42m',
    BgYellow = '\x1b[43m',
    BgBlue = '\x1b[44m',
    BgMagenta = '\x1b[45m',
    BgCyan = '\x1b[46m',
    BgWhite = '\x1b[47m',
}

const prettyArgument = (args: any[]): any[] => {
    if (args.length === 1) {
        const [o] = args;
        return [{
            type: o.dataType === DataType.vector ? `vector ${o.value.length}` : o.tokenType,
            o,
        }, o.value];
    } else {
        return args;
    }
}

export const builtInFuncs = {
    print: {
        func(...args) {
            if (runningInBrowser) {
                console.log(`%cprint ==>`, 'color: green', ...prettyArgument(args));
            } else {
                console.log(`${ColoredConsole.FgGreen}print ==>`, ...prettyArgument(args));
            }
        },
    },
    v: {
        returnType: TokenType.data,
        returnData: DataType.vector,
        func(...args: TokenNumber[]): TokenVector {
            return {
                tokenType: TokenType.data,
                dataType: DataType.vector,
                value: Array.of(...args.map(t => {
                    if (t.tokenType !== TokenType.NumberLiteral) {
                        throw new Error(`argument for vector should be only number type`);
                    }
                    return t.value;
                })),
            }
        },
    }
}