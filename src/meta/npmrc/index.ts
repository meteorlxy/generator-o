import BaseGenerator from '../../base-generator';

export = class NpmrcGenerator extends BaseGenerator {
  private registry: string | false;

  private proxy: string | false;

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

  initializing(): void {
    this.registry = this.options.registry;
    this.proxy = this.options.proxy;
  }

  writing(): void {
    this.fs.copyTpl(
      this.templatePath('.npmrc.ejs'),
      this.destinationPath('.npmrc'),
      {
        registry: this.registry,
        proxy: this.proxy,
      }
    );
  }
};
