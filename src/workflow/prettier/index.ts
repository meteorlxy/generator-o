import BaseGenerator from '../../base-generator';

export = class PrettierGenerator extends BaseGenerator {
  protected sharedConfig: string | Record<string, string | number | boolean>;

  constructor(args, options) {
    super(args, options);

    this.option('sharedConfig', {
      type: String,
      default: '',
      description: 'sharedConfig to use',
    });
  }

  initializing(): void {
    this.sharedConfig = this.options.sharedConfig || {
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
    };
  }

  writing(): void {
    const devDeps = ['prettier'];

    if (typeof this.sharedConfig === 'string') {
      devDeps.push(this.sharedConfig);
    }

    this.addFields({
      prettier: this.sharedConfig,
    });

    this.addDependencies({ devDeps });
  }
};
