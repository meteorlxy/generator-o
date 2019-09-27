import BaseGenerator from '../../base-generator';

export = class GitGenerator extends BaseGenerator {
  protected packageManager: 'npm' | 'yarn';

  protected typescript: boolean;

  protected coverage: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('packageManager', {
      type: String,
      default: 'npm',
      description: 'package manager to use',
    });

    this.option('typescript', {
      type: Boolean,
      default: false,
      description: 'use typescript or not',
    });

    this.option('coverage', {
      type: Boolean,
      default: false,
      description: 'has coverage or not',
    });
  }

  initializing(): void {
    this.packageManager = this.options.packageManager;
    this.typescript = this.options.typescript;
    this.coverage = this.options.coverage;
  }

  writing(): void {
    this.fs.copy(
      this.templatePath('.gitattributes'),
      this.destinationPath('.gitattributes')
    );

    this.fs.copyTpl(
      this.templatePath('.gitignore.ejs'),
      this.destinationPath('.gitignore'),
      {
        packageManager: this.packageManager,
        typescript: this.typescript,
        coverage: this.coverage,
      }
    );
  }
};
