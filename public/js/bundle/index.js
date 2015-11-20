const acpt = $('[name="acpt"]').attr('content');

function postSnippet() {
    const code = $('.code').val();
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
