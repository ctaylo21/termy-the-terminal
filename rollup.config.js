import cleaner from 'rollup-plugin-cleaner';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';
import scss from 'rollup-plugin-scss';
import resolve from 'rollup-plugin-node-resolve';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';
import url from 'rollup-plugin-url';

export const getBasePlugins = targetFolder => [
  cleaner({ targets: [targetFolder] }),
  url({ exclude: ['**/*.svg'] }),
  svgr(),
  resolve(),
  scss({
    output: `${targetFolder}/index.css`,
  }),
];

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    ...getBasePlugins('dist'),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs(),
    external(),
  ],
};
