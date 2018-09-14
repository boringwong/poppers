import clear from 'rollup-plugin-clear';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import {uglify} from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import pkg from './package.json';

const input = './src/index.js';
const firstPlugins = [
    clear({
        targets: ['dist']
    }),
    nodeResolve(),
    babel()
];
const lastPlugins = [
    license({
        banner:
`/*!
 * Poppers v<%=pkg.version%>
 * Copyright (c) 2018-present <%=pkg.author%>
 * <%=pkg.license%> license
 */`
    })
];
const configs = [
    {
        input,
        output: [
            {
                file: pkg.module,
                format: 'es'
            },
            {
                file: pkg.main,
                format: 'cjs'
            }
        ],
        plugins: [
            ...firstPlugins,
            postcss({
                inject: false
            }),
            ...lastPlugins
        ],
        external: (id) => /^\w/.test(id)
    },
    {
        input,
        output: {
            file: pkg.browser,
            format: 'umd',
            name: pkg.name,
            sourcemap: true
        },
        plugins: [
            ...firstPlugins,
            commonjs(),
            postcss({
                extract: true
            }),
            uglify(),
            ...lastPlugins
        ]
    }
];

export default configs;
