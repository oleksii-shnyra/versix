requirejs(["src/versix-lib/index"], function ({ versix }) {
    const span = document.querySelector('.version-date');
    span.innerText = versix.version;

    const textarea = document.querySelector('textarea');
    const button = document.querySelector('button');

    textarea.value = versix.default_program;

    button.onclick = () => {
        const tokens = versix.tokenizer(textarea.value);
        versix.helper.prettyLexLog(tokens);

        const parser = new versix.Parser(tokens);
        console.log('AST', JSON.stringify(parser.getAst(), null, 2));

        versix.run(parser.getAst());
    }
});