import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import scss from 'rollup-plugin-scss';
import cleaner from 'rollup-plugin-cleaner';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export const getBasePlugins = targetFolder => [
  cleaner({ targets: [targetFolder] }),
  url({ exclude: ['**/*.svg'] }),
  svgr(),
  resolve(),
  typescript({
    rollupCommonJSResolveHack: true,
    clean: true,
  }),
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
  plugins: [...getBasePlugins('dist'), commonjs(), external()],
};
