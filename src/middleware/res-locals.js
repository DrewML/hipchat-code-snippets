export default function middleware(req, res, next) {
    res.locals.isDark = req.query.theme === 'dark';
    next();
}
