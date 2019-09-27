import BaseGenerator from '../../base-generator';

export = class VscodeGenerator extends BaseGenerator {
  protected typescript: boolean;

  protected vue: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('typescript', {
      type: Boolean,
      default: false,
      description: 'use typescript or not',
    });

    this.option('vue', {
      type: Boolean,
      default: false,
      description: 'use vue or not',
    });
  }

  initializing(): void {
    this.typescript = this.options.typescript;
    this.vue = this.options.vue;
  }

  writing(): void {
    this.fs.copyTpl(
      this.templatePath('settings.ejs'),
      this.destinationPath('.vscode/settings.json'),
      {
        typescript: this.typescript,
        vue: this.vue,
      }
    );
  }
};
