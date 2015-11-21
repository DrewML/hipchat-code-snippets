import cors from 'cors';
import gistAPI from '../gist-api';
import {Router} from 'express';
import aceLangs from '../ace-languages';

const gist = gistAPI();
const langsByExt = aceLangs.reduce((collection, next) => {
    collection[next.ext] = next;
    return collection;
}, {});

export function register(app, addon) {
    const router = Router();
    [cors(), addon.authenticate()].forEach(fn => router.use(fn));

    router.get('/add-snippet', (req, res) => {
        res.render('dialog/add', {
            languages: aceLangs
        });
    });

    router.get('/snippet/view/:id', (req, res) => {
        gist.get(req.params.id).then(gistRes => {
            const file = gistRes.files[Object.keys(gistRes.files)[0]];
            const ext = file.filename.replace('hipchat.', '');

            res.render('dialog/view', {
                code: file.content,
                mode: langsByExt[ext].mode
            });
        }).catch(err => {
            console.error(err);
            res.status(500).send();
        });
    });

    app.use('/ui', router);
}
