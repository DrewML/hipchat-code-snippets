import cors from 'cors';
import {Router} from 'express';

export function register(app, addon) {
    const router = Router();
    [cors(), addon.authenticate()].forEach(fn => router.use(fn));

    router.get('/add-snippet', (req, res) => {
        res.render('dialog/add');
    });

    app.use('/ui', router);
}
