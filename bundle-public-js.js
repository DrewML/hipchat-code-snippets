'use strict';

const rollup = require('rollup').rollup;
const rollupBabel = require('rollup-plugin-babel');

const bundleConfig = [{
    entry: './public/js/add/index.js',
    dest: './public/dist/add.js'
}, {
    entry: './public/js/view/index.js',
    dest: './public/dist/view.js'
}];

const bundles = bundleConfig.map(config => {
    return rollup({
        entry: config.entry,
        plugins: [
            rollupBabel({
                presets: ['es2015-rollup']
            })
        ]
    });
});

Promise.all(bundles).then(results => {
    return Promise.all(results.map((bundle, i) => {
        return bundle.write({
            format: 'iife',
            dest: bundleConfig[i].dest,
            sourceMap: 'inline'
        });
    }));
}).catch(err => console.error(err.stack));
