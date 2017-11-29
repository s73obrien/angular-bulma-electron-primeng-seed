import electron = require('electron');
import { spawn, SpawnOptions, ChildProcess } from 'child_process';
import { resolve } from 'path';
import { Compiler, Stats } from 'webpack';

interface ElectronLiveReloadPluginOptions
{
  test: RegExp;
  path: string;
  args?: string[];
  options?: SpawnOptions
}

export default class ElectronLiveReloadPlugin
{
  options: ElectronLiveReloadPluginOptions;
  child: ChildProcess;
  hashIndex: number[] = [];

  constructor(options: ElectronLiveReloadPluginOptions)
  {
    this.options = options;
    this.options.args = this.options.args || [];
    this.options.options = this.options.options || {};
    this.options.options.stdio = this.options.options.stdio || 'inherit';
  }

  launch() {
    if (this.child)
    {
      this.child.kill();
      this.child = undefined;
    }

    this.child = spawn(
      electron as any,
      this.options.args.concat(this.options.path),
      this.options.options
    )
  }

  apply(compiler: Compiler) {
    compiler.plugin("done", (stats) => {
      let relaunch = false;
      stats.compilation.modules.forEach(module => {
        if (!module.resource) return true;
        if (!module._cachedSource) return true;

        const hash = module._cachedSource.hash;
        const split = module.portableId.split('!');
        const id = split[split.length - 1];

        if (id.match(this.options.test)
        && this.hashIndex[module.resource] !== hash)
        {
          relaunch = true;
        }

        this.hashIndex[module.resource] = hash;
      })

      if (relaunch) {
        this.launch();
      }
    })
  }
}