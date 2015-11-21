import createEditor from '../editor';

const editor = createEditor({ domID: 'editor' });
editor.languageMode = $('#editor').attr('data-language-mode');
