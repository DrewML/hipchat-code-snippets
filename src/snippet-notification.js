import hipchatAPI from './hipchat-api';
import escapeHTML from 'escape-html';

const hipchat = hipchatAPI();

export default function send({roomID, token, userID, gist, lang}) {
    return hipchat.getRoom(roomID, token).then(room => {
        const user = room.participants.find(user => user.id == userID);
        return hipchat.sendRoomNotification(roomID, token, {
            format: 'html',
            color: 'gray',
            message: [
                `${user.name} posted a new ${lang.name} snippet`,
                `<a href="${gist.html_url}">Check it out here</a>`
            ].join(' - '),
            card: {
                style: 'application',
                icon: {
                    url: 'http://i.imgur.com/2Yto3ew.png'
                },
                url: gist.html_url,
                title: `${user.name} just posted a new ${lang.name} snippet`,
                description: {
                    format: 'html',
                    value: generateLink({
                        text: 'You can view it by clicking here',
                        id: gist.id,
                        userName: user.name,
                        language: lang.name
                    })
                },
                format: 'compact',
                id: gist.id,
                date: Date.now()
            }
        });
    });
}

function generateLink({text, id, userName, language}) {
    const opts = escapeHTML(JSON.stringify({
        urlTemplateValues: { id },
        parameters: { userName, language }
    }));

    return [
        '<a href="#" data-target="codesnippet:codesnippet.dialog.view" ',
        `data-target-options="${opts}">${text}</a>`
    ].join('');
}
