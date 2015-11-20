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
                const roomId = req.clientInfo.roomId;

                return hipchat.sendRoomNotification(roomId, token, {
                    format: 'html',
                    message: `Someone created a gist! <a href="${gistRes.html_url}">Check it out here</a>`
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
