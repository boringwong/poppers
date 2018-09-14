const presetEnv = require('postcss-preset-env');
const importCss = require('postcss-import');
const banner = require('postcss-banner');
const cssnano = require('cssnano');
const pkg = require('./package.json');

module.exports = {
    plugins: [
        importCss(),
        presetEnv({
            stage: 0,
            features: {
                'color-mod-function': {
                    transformVars: true
                }
            }
        }),
        cssnano(),
        banner({
            banner:
`Poppers v${pkg.version}
Copyright (c) 2018-present ${pkg.author}
${pkg.license} license`,
            important: true
        })
    ]
};
