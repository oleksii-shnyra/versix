import { Token } from "../interface";

export class TokenizerResult {
    constructor(public consumedChars = 0, public token: Token | null = null) {}
}