import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import scss from 'rollup-plugin-scss';
import replace from 'rollup-plugin-replace';

export default {
  input: 'src/demo.tsx',
  output: [
    {
      file: 'docs/demo.js',
      format: 'iife',
      name: 'termy',
    },
  ],
  plugins: [
    svgr(),
    resolve(),
    url({ exclude: ['**/*.svg'] }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: { compilerOptions: { declaration: false } },
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': [
          'Component',
          'PureComponent',
          'Fragment',
          'Children',
          'createElement',
        ],
      },
    }),
    scss({
      output: 'docs/index.css',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
