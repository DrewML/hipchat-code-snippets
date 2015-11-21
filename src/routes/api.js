import cors from 'cors';
import gistAPI from '../gist-api';
import {Router} from 'express';
import aceLangs from '../ace-languages';
import sendNotification from '../snippet-notification';

const gist = gistAPI();

const langsByMode = aceLangs.reduce((collection, next) => {
    collection[next.mode] = next;
    return collection;
}, {});

export function register(app, addon) {
    const router = Router();
    [cors(), addon.authenticate()].forEach(fn => router.use(fn));

    router.post('/snippets/add', (req, res) => {
        const language = langsByMode[req.body.mode];
        gist.createAnon({
            code: req.body.code,
            ext: language.ext
        }).then(gistRes => {
            res.status(200).send();

            return addon.getAccessToken(req.clientInfo).then(auth => {
                const token = auth.access_token;
                const roomID = req.clientInfo.roomId;
                const userID = req.identity.userId;

                return sendNotification({
                    roomID,
                    token,
                    userID,
                    gist: gistRes,
                    lang: language
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
