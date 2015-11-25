import os from 'os';
import ac from 'atlassian-connect-express';
import hbs from 'express-hbs';
import path from 'path';
import expiry from 'static-expiry';
import morgan from 'morgan';
import express from 'express';
import acHipchat from 'atlassian-connect-express-hipchat';
import {multiUse} from './utils';
import requireDir from 'require-dir';
import bodyParser from 'body-parser';
import addonEvents from './addon-events';
import compression from 'compression';
import errorHandler from 'errorhandler';

const redisAddon = 'atlassian-connect-express-redis';
try {
    ac.store.register('redis', require(redisAddon));
} catch(e) {
    console.warn([
        `Optional dep '${redisAddon}' not found.`,
        `You must configure an alternative store in 'config.js'.`
    ].join(' '));
}

const app = express();
const addon = ac(app);
const hipchat = acHipchat(addon, app);
const staticDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../views');
const devEnv = app.get('env') === 'development';
const middleware = requireDir('./middleware');
const routes = requireDir('./routes');
const expiryConfig = { dir: staticDir, debug: devEnv };

// Listen/respond to HipChat addon events (Installed/Uninstalled)
addonEvents(addon);

app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, '../views'),
    defaultLayout: path.join(__dirname, '../views/base.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerHelper('furl', url => app.locals.furl(url));

if (!process.env.PWD) process.env.PWD = process.cwd(); // Fix expiry on Windows

if (devEnv) app.use(errorHandler());
multiUse(app,
    morgan(devEnv ? 'dev' : 'common'),
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    compression(),
    expiry(app, expiryConfig),
    addon.middleware(),
    express.static(staticDir),
    ...Object.keys(middleware).map(key => middleware[key].default)
);

// Register routes
Object.keys(routes).map(key => routes[key].register(app, addon));

const server = app.listen(addon.config.port(), () => {
    const port = server.address().port;
    const uri = addon.config.localBaseUrl() || `http://${os.hostname()}:${port}`
    console.log(`Addon server running at: ${uri}`.green);
});
