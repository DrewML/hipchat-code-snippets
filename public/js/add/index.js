import postSnippet from '../post-snippet';
import createEditor from '../editor';
import langSelector from '../language-selector';
import * as dialogBtn from '../dialog-button';

const editor = createEditor({ domID: 'editor' });

const langSelect = langSelector({
    $el: $('#select-language')
}).onChange(val => editor.languageMode = val);

dialogBtn.onClick((e, close) => {
    postSnippet({
        code: editor.value,
        mode: langSelect.value
    }).then(() => close());
});
