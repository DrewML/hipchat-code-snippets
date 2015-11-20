export function onClick(cb) {
    return AP.register({
        'dialog-button-click': cb
    });
}
