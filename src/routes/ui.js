import cors from 'cors';
import {Router} from 'express';
import aceLangs from '../ace-languages';

export function register(app, addon) {
    const router = Router();
    [cors(), addon.authenticate()].forEach(fn => router.use(fn));

    router.get('/add-snippet', (req, res) => {
        res.render('dialog/add', {
            languages: aceLangs
        });
    });

    app.use('/ui', router);
}
