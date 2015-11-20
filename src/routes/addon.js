import cors from 'cors';
import {Router} from 'express';

export function register(app, addon) {
    const router = Router();

    router.get('/', function(req, res) {
        res.format({
            'text/html': () => res.redirect(addon.descriptor.links.homepage),
            'application/json': () => res.redirect('/atlassian-connect.json')
        });
    });

    // router.get('/glance', cors(), addon.authenticate(), (req, res) => {
    //     let glancedata = {
    //         label: {
    //             type: 'html',
    //             value: 'My Sample Glance'
    //         }
    //     };
    //     res.send(glancedata);
    // });

    router.get('/config', addon.authenticate(), (req, res) => {
        res.render('config', req.context);
    });

    app.use(router);
}
