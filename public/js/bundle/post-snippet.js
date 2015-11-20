import token from './token';

export default function postSnippet({code, mode}) {
    return $.ajax({
        type: 'POST',
        url: '/api/snippets/add',
        contentType: 'application/json',
        headers: { 'X-acpt': token },
        data: JSON.stringify({ code, mode }),
        processData: false
    });
}
