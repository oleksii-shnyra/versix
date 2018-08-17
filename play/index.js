requirejs(["src/versix-lib/index"], function ({ versix }) {
    const span = document.querySelector('.version-date');
    span.innerText = versix.version;

    const textarea = document.querySelector('textarea');
    const button = document.querySelector('button');

    textarea.value = versix.default_program;

    button.onclick = () => {
        const tokens = versix.tokenizer(textarea.value);
        versix.helper.prettyLexLog(tokens);

        const ast = versix.parser(tokens);
        console.log('AST', JSON.stringify(ast, null, 2));

        versix.run(ast);
    }
});