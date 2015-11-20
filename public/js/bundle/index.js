import postSnippet from './post-snippet';
import createEditor from './editor';
import langSelector from './language-selector';

const editor = createEditor({ domID: 'editor' });

const langSelect = langSelector({
    $el: $('#select-language')
}).onChange(val => editor.languageMode = val);

AP.register({
    'dialog-button-click': (e, close) => {
        postSnippet({
            code: editor.value,
            mode: langSelect.value
        }).then(() => close());
    }
});
