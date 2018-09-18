import clear from 'rollup-plugin-clear';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import {uglify} from 'rollup-plugin-uglify';
import pkg from './package.json';

const input = './src/index.js';
const banner = `/*!
 * Poppers v${pkg.version}
 * Copyright (c) 2018-present ${pkg.author}
 * ${pkg.license} license
 */`;
const firstPlugins = [
    clear({
        targets: ['dist']
    }),
    nodeResolve(),
    babel()
];
const configs = [
    {
        input,
        output: [
            {
                file: pkg.module,
                format: 'es',
                banner
            },
            {
                file: pkg.main,
                format: 'cjs',
                banner
            }
        ],
        plugins: [
            ...firstPlugins,
            postcss({
                inject: false
            })
        ],
        external: (id) => /^\w/.test(id)
    },
    {
        input,
        output: {
            file: pkg.browser,
            format: 'umd',
            name: pkg.name,
            sourcemap: true,
            banner
        },
        plugins: [
            ...firstPlugins,
            commonjs(),
            postcss({
                extract: true
            }),
            uglify({
                output: {
                    comments: /Poppers/
                }
            })
        ]
    }
];

export default configs;
