const acpt = $('[name="acpt"]').attr('content');

const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript')

function postSnippet() {
    const code = editor.getValue();
    return $.ajax({
        type: 'POST',
        url: '/api/snippets/add',
        contentType: 'application/json',
        headers: { 'X-acpt': acpt },
        data: JSON.stringify({ code }),
        processData: false
    });
}

AP.register({
    'dialog-button-click': (e, close) => {
        postSnippet().then(() => close());
    }
});
