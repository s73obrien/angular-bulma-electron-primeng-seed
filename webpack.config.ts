import { realpathSync } from 'fs';
import { join, resolve } from 'path';
import CopyWebpackPlugin = require('copy-webpack-plugin');
import { ProgressPlugin } from 'webpack';
import CircularDependencyPlugin = require('circular-dependency-plugin');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import rxPaths = require('rxjs/_esm5/path-mapping');
import autoprefixer = require('autoprefixer');
import postcssUrl = require('postcss-url');
import cssnano = require('cssnano');
import customProperties = require('postcss-custom-properties');
import './webpack-plugin/electron-live-reload';
import WriteFilePlugin = require('write-file-webpack-plugin');

import {
  NoEmitOnErrorsPlugin,
  SourceMapDevToolPlugin,
  NamedModulesPlugin,
  DefinePlugin
} from 'webpack';

import {
  NamedLazyChunksWebpackPlugin,
  BaseHrefWebpackPlugin,
} from '@angular/cli/plugins/webpack';

import { optimize } from 'webpack';
const CommonsChunkPlugin = optimize.CommonsChunkPlugin;

import { AngularCompilerPlugin } from '@ngtools/webpack';
import ElectronLiveReloadPlugin from './webpack-plugin/electron-live-reload';

const nodeModules = join(process.cwd(), 'node_modules');
const realNodeModules = realpathSync(nodeModules);
const genDirNodeModules = join(process.cwd(), 'renderer', '$$_gendir', 'node_modules');
const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];
const minimizeCss = false;
const baseHref = '';
const deployUrl = '';
const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    autoprefixer: false,
    safe: true,
    mergeLonghand: false,
    discardComments: {
      remove: (comment) => !importantCommentRe.test(comment)
    }
  };
  return [
    postcssUrl({
      url: (URL) => {
        const {
          url
        } = URL;
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!url.startsWith('/') || url.startsWith('//')) {
          return URL.url;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${url}`;
        } else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
        } else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
    customProperties({
      preserve: true,
      warnings: false
    }),
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

module.exports = [
  { // Angular
    'target': 'electron-renderer',
    'resolve': {
      'extensions': [
        '.ts',
        '.js'
      ],
      'modules': [
        './node_modules',
        './node_modules'
      ],
      'symlinks': true,
      'alias': rxPaths(),
      'mainFields': [
        'browser',
        'module',
        'main'
      ]
    },
    'resolveLoader': {
      'modules': [
        './node_modules',
        './node_modules'
      ],
      'alias': rxPaths()
    },
    'entry': {
      'main': [
        'webpack-dev-server/client?http://localhost:8080',
        './renderer\\main.ts'
      ],
      'polyfills': [
        './renderer\\polyfills.ts'
      ],
      'styles': [
        './renderer\\styles.scss'
      ]
    },
    'output': {
      'path': join(process.cwd(), 'dist'),
      'filename': '[name].bundle.js',
      'chunkFilename': '[id].chunk.js',
      'crossOriginLoading': false
    },
    'module': {
      'rules': [{
        'test': /\.html$/,
        'loader': 'raw-loader'
      },
      {
        'test': /\.(eot|svg|cur)$/,
        'loader': 'file-loader',
        'options': {
          'name': '[name].[hash:20].[ext]',
          'limit': 10000
        }
      },
      {
        'test': /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        'loader': 'url-loader',
        'options': {
          'name': '[name].[hash:20].[ext]',
          'limit': 10000
        }
      },
      {
        'exclude': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.css$/,
        'use': [
          'exports-loader?module.exports.toString()',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          }
        ]
      },
      {
        'exclude': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.scss$|\.sass$/,
        'use': [
          'exports-loader?module.exports.toString()',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          },
          {
            'loader': 'sass-loader',
            'options': {
              'sourceMap': false,
              'precision': 8,
              'includePaths': []
            }
          }
        ]
      },
      {
        'exclude': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.less$/,
        'use': [
          'exports-loader?module.exports.toString()',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          },
          {
            'loader': 'less-loader',
            'options': {
              'sourceMap': false
            }
          }
        ]
      },
      {
        'exclude': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.styl$/,
        'use': [
          'exports-loader?module.exports.toString()',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          },
          {
            'loader': 'stylus-loader',
            'options': {
              'sourceMap': false,
              'paths': []
            }
          }
        ]
      },
      {
        'include': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.css$/,
        'use': [
          'style-loader',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          }
        ]
      },
      {
        'include': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.scss$|\.sass$/,
        'use': [
          'style-loader',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false,

            }
          },
          {
            'loader': 'sass-loader',
            'options': {
              'sourceMap': false,
              'precision': 8,
              'includePaths': []
            }
          }
        ]
      },
      {
        'include': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.less$/,
        'use': [
          'style-loader',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          },
          {
            'loader': 'less-loader',
            'options': {
              'sourceMap': false
            }
          }
        ]
      },
      {
        'include': [
          join(process.cwd(), 'renderer\\styles.scss')
        ],
        'test': /\.styl$/,
        'use': [
          'style-loader',
          {
            'loader': 'css-loader',
            'options': {
              'sourceMap': false,
              'importLoaders': 1
            }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              'ident': 'postcss',
              'plugins': postcssPlugins,
              'sourceMap': false
            }
          },
          {
            'loader': 'stylus-loader',
            'options': {
              'sourceMap': false,
              'paths': []
            }
          }
        ]
      },
      {
        'test': /renderer(?:\\|\/).+(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        'use': [
          '@ngtools/webpack'
        ]
      }
      ]
    },
    'plugins': [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new WriteFilePlugin(),
      new NoEmitOnErrorsPlugin(),
      new CopyWebpackPlugin([{
        'context': 'renderer',
        'to': '',
        'from': {
          'glob': 'assets/**/*',
          'dot': true
        }
      },
      {
        'context': 'renderer',
        'to': '',
        'from': {
          'glob': 'favicon.ico',
          'dot': true
        }
      }
      ], {
          'ignore': [
            '.gitkeep',
            '**/.DS_Store',
            '**/Thumbs.db'
          ],
          'debug': 'warning'
        }),
      new ProgressPlugin(),
      new CircularDependencyPlugin({
        'exclude': /(\\|\/)node_modules(\\|\/)/,
        'failOnError': false
      }),
      new NamedLazyChunksWebpackPlugin(),
      new HtmlWebpackPlugin({
        'template': './renderer\\index.html',
        'filename': './index.html',
        'hash': false,
        'inject': true,
        'compile': true,
        // "favicon": false,
        'minify': false,
        'cache': true,
        'showErrors': true,
        // "chunks": "all",
        'excludeChunks': [],
        'title': 'Webpack App',
        'xhtml': true,
        'chunksSortMode': function sort(left, right) {
          const leftIndex = entryPoints.indexOf(left.names[0]);
          const rightindex = entryPoints.indexOf(right.names[0]);
          if (leftIndex > rightindex) {
            return 1;
          } else if (leftIndex < rightindex) {
            return -1;
          } else {
            return 0;
          }
        }
      }),
      new BaseHrefWebpackPlugin({ baseHref: '' }),
      new CommonsChunkPlugin({
        'name': 'inline',
        'minChunks': null
      }),
      new CommonsChunkPlugin({
        'name': 'vendor',
        'minChunks': (module) => {
          return module.resource &&
            (module.resource.startsWith(nodeModules) ||
              module.resource.startsWith(genDirNodeModules) ||
              module.resource.startsWith(realNodeModules));
        },
        'chunks': [
          'main'
        ]
      }),
      new SourceMapDevToolPlugin({
        'filename': '[file].map[query]',
        'moduleFilenameTemplate': '[resource-path]',
        'fallbackModuleFilenameTemplate': '[resource-path]?[hash]',
        'sourceRoot': 'webpack:///'
      }),
      new CommonsChunkPlugin({
        'name': 'main',
        'minChunks': 2,
        'async': 'common'
      }),
      new NamedModulesPlugin(),
      new AngularCompilerPlugin({
        'mainPath': 'main.ts',
        'platform': 0,
        'hostReplacementPaths': {
          'environments\\environment.ts': 'environments\\environment.ts'
        },
        'sourceMap': true,
        'tsConfigPath': 'renderer\\tsconfig.app.json',
        'compilerOptions': {}
      })
    ],
    'node': {
      'fs': 'empty',
      'global': true,
      'crypto': 'empty',
      'tls': 'empty',
      'net': 'empty',
      'process': true,
      'module': false,
      'clearImmediate': false,
      'setImmediate': false
    },
    'devServer': {
      'historyApiFallback': true,
      'inline': false
    }
  },
  { // Electron Main
    'entry': {
      'main_process': [
        './main\\main.ts'
      ]
    },
    'devtool': 'source-map',
    'output': {
      'path': join(process.cwd(), 'dist'),
      'filename': '[name].bundle.js',
      'chunkFilename': '[id].chunk.js',
      'crossOriginLoading': false,
    },
    'resolve': {
      'extensions': [
        '.ts',
        '.js'
      ],
      'modules': [
        './node_modules'
      ],
    },
    'target': 'electron-main',
    'module': {
      'rules': [{
        'test': /\.tsx?$/,
        'include': [
          resolve(__dirname, 'main')
        ],
        'use': [{
          'loader': 'ts-loader'
        }]
      }]
    },
    'plugins': [
      new ElectronLiveReloadPlugin({
        test: /main(\/|\\).+\.(ts|js)$/,
        path: './dist/main_process.bundle.js'
      }),
      new WriteFilePlugin()
    ]
  }
];
