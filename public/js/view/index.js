import createEditor from '../editor';

const editor = createEditor({
    domID: 'editor',
    readOnly: true
});
editor.languageMode = $('#editor').attr('data-language-mode');

AP.register({
    'receive-parameters': ({userName, language}) => {
        AP.require('dialog', dialog => {
            dialog.update({
                title: `${userName}'s ${language} Snippet`
            });
        });
    }
});
