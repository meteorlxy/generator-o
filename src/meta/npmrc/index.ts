import fs from 'fs';
import ejs from 'ejs';
import BaseGenerator from '../../base-generator';

export = class NpmrcGenerator extends BaseGenerator {
  protected registry: string | false;

  protected proxy: string | false;

  constructor(args, options) {
    super(args, options);

    this.option('registry', {
      type: String,
      default: '',
      description: 'registry to use',
    });

    this.option('proxy', {
      type: String,
      default: '',
      description: 'proxy to use',
    });
  }

  async initializing(): Promise<void> {
    this.registry = this.options.registry;
    this.proxy = this.options.proxy;

    // npmrc is useful for following process, so we generated it in `intializing` stage
    const npmrc = await ejs.renderFile(this.templatePath('.npmrc.ejs'), {
      registry: this.registry,
      proxy: this.proxy,
    });

    fs.writeFileSync(this.destinationPath('.npmrc'), npmrc);
  }
};
