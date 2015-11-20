import cors from 'cors';
import gistAPI from '../gist-api';
import {Router} from 'express';

const gist = gistAPI();

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
            
            // Send Card to HipChat here
        }).catch(err => genericErrHandler(err, res));
    });

    app.use('/api', router);
}

function genericErrHandler(err, res) {
    console.error(err);
    res.status(500).send(':(');
}
