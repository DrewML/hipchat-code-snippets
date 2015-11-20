export default function eventHandler(addon) {
    addon.on('installed', (clientKey, clientInfo, req) => {
        // 1,2,3,4, we don't care about this no more!
    });

    addon.on('uninstalled', id => {
        addon.settings.client.keys(`${id}:*`, function(err, rep) {
            rep.forEach(function(k) {
                addon.logger.info('Removing key:', k);
                addon.settings.client.del(k);
            });
        });
    });
}
