import electron = require('electron');
import { spawn, SpawnOptions, ChildProcess } from 'child_process';
import { resolve } from 'path';
import { Compiler, Stats } from 'webpack';

interface ElectronLiveReloadPluginOptions {
  test: RegExp;
  path: string;
  args?: string[];
  options?: SpawnOptions;
}

export default class ElectronLiveReloadPlugin {
  options: ElectronLiveReloadPluginOptions;
  child: ChildProcess;
  hashIndex: number[] = [];
  persistence: (number, string) => void;
  first: Boolean = true;

  constructor(options: ElectronLiveReloadPluginOptions) {
    this.options = options;
    this.options.args = this.options.args || [];
    this.options.options = this.options.options || {};
    this.options.options.stdio = this.options.options.stdio || 'inherit';
    this.persistence = this.persistencePreBind.bind(this);
  }

  persistencePreBind(code, signal) {
    console.log('Electron process exited with code: ' + code);

    if (signal) {
      console.log('Signal given was: ' + signal);
    }

    this.child = spawn(
      electron as any,
      this.options.args.concat(this.options.path),
      this.options.options
    );

    this.child.on('exit', this.persistence);
  }

  apply(compiler: Compiler) {

    compiler.plugin('after-emit', (compilation, callback) => {
      const changes = compilation.modules.filter(module => {
        if (module.resource && module._cachedSource) {
          const hash = module._cachedSource.hash;
          const id = module.id.split('!').pop();
          const old = this.hashIndex[module.resource];
          this.hashIndex[module.resource] = hash;
          return (hash !== old) && id.match(this.options.test);
        } else {
          return false;
        }
      }).length > 0;

      if (changes || this.first) {
        this.first = false;

        if (this.child) {
          this.child.removeListener('exit', this.persistence);
          this.child.kill();
        }

        console.log('Starting Electron application');
        this.child = spawn(
          electron as any,
          this.options.args.concat(this.options.path),
          this.options.options
        );

        this.child.on('exit', this.persistence);
      }

      callback();
    });
  }
}
