import fs from 'fs';
import path from 'path';

import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import strip from 'rollup-plugin-strip';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import stylus from 'rollup-plugin-stylus-compiler';
import css from 'rollup-plugin-css-only';

const root = __dirname
    , src = path.join(root, 'src')
    , dst = path.join(root, 'dst')
    , mod = path.join(root, 'node_modules')
    ;

const development = {
  input: path.join(src, 'index.ts')
, output: {
    file: path.join(dst, 'js', 'script.js')
  , format: 'iife'
  , sourcemap: true
  }
, plugins: [
    typescript({
      abortOnError: false
    , cacheRoot: '.cache'
    })
  , commonjs()
  , replace({
      preventAssignment: true
    , values: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    })
  , resolve({
      browser: false
    , preferBuiltins: true
    , mainFields: ['dev:module', 'module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , json()
  , stylus()
  , css({
      output: function(data, _nodes) {
        const file = path.join(dst, 'css', 'style.css');
        fs.mkdir(path.dirname(file), {recursive: true}, (err) => {
          if (err) throw err;
          fs.writeFileSync(file, data);
        });
      }
    })
  , buble({
      objectAssign: 'Object.assign'
    , transforms: {
        asyncAwait: false
      , forOf: false
      , generator: false
      }
    })
  , strip({
      debugger: false
    , functions: []
    , include: [
        path.join(src, '**/*.ts')
      , path.join(mod, '**/*.(ts|js)')
      ]
    , sourceMap: true
    })
  ]
};

const production = {
  input: path.join(src, 'index.ts')
, output: [{
    file: path.join(dst, 'js', 'script.min.js')
  , format: 'iife'
  , sourcemap: false
  }]
, plugins: [
    typescript({
      abortOnError: true
    , cacheRoot: '.cache'
    })
  , commonjs()
  , replace({
      preventAssignment: true
    , values: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    })
  , resolve({
      browser: false
    , preferBuiltins: true
    , mainFields: ['module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , json()
  , stylus()
  , css({
      output: function(data, _nodes) {
        const file = path.join(dst, 'css', 'style.css');
        fs.mkdir(path.dirname(file), {recursive: true}, (err) => {
          if (err) throw err;
          fs.writeFileSync(file, data);
        });
      }
    })
  , buble({
      objectAssign: 'Object.assign'
    , transforms: {
        asyncAwait: false
      , forOf: false
      , generator: false
      }
    })
  , strip({
      debugger: true
    , functions: ['console.*', 'assert.*']
    , include: [
        path.join(src, '**/*.ts')
      , path.join(mod, '**/*.(js|ts)')
      ]
    , sourceMap: false
    })
  , terser()
  ]
};

export default (args) => {
  if (args.configBuildDebug === true) {
    return development;
  } else if (args.configBuildRelease === true) {
    return production;
  }
  throw new Error("unknown args given :'(");
};
