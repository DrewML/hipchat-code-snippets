import cors from 'cors';
import gistAPI from '../gist-api';
import hipchatAPI from '../hipchat-api';
import {Router} from 'express';

const gist = gistAPI();
const hipchat = hipchatAPI();

export function register(app, addon) {
    const router = Router();
    [cors(), addon.authenticate()].forEach(fn => router.use(fn));

    router.get('/snippets/:id', (req, res) => {
        gist.get(req.params.id).then(gistRes => {
            res.json(gistRes);
        }).catch(err => genericErrHandler(err, res));
    });

    router.post('/snippets/add', (req, res) => {
        gist.createAnon({
            code: req.body.code
        }).then(gistRes => {
            res.status(200).send();

            return addon.getAccessToken(req.clientInfo).then(auth => {
                const token = auth.access_token;
                const roomID = req.clientInfo.roomId;
                const userID = req.identity.userId;

                return hipchat.getRoom(roomID, token).then(room => {
                    const user = room.participants.find(user => user.id == userID);
                    return hipchat.sendRoomNotification(roomID, token, {
                        format: 'html',
                        message: [
                            `${user.name} posted a new code snippet`,
                            `<a href="${gistRes.html_url}">Check it out here</a>`
                        ].join(' - '),
                        card: {
                            style: 'application',
                            url: gistRes.html_url,
                            title: `${user.name} just posted a new code snippet`,
                            format: 'compact',
                            id: gistRes.id,
                            date: Date.now()
                        }
                    });
                });
            });
        }).catch(err => genericErrHandler(err, res));
    });

    app.use('/api', router);
}

function genericErrHandler(err, res) {
    console.error(err);
    res.status(500).send(':(');
}
