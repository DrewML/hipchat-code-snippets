export function multiUse(app, middleware = []) {
    return middleware.map(fn => {
        return Array.isArray(fn) ? app.use(...fn) : app.use(fn);
    });
}
