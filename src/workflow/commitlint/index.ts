import BaseGenerator from '../../base-generator';

export = class CommitlintGenerator extends BaseGenerator {
  protected lerna: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('lerna', {
      type: Boolean,
      default: false,
      description: 'use lerna or not',
    });
  }

  initializing(): void {
    this.lerna = this.options.lerna;
  }

  writing(): void {
    const extendsConfig = ['@commitlint/config-conventional'];
    const devDeps = ['@commitlint/cli', '@commitlint/config-conventional'];

    if (this.lerna) {
      extendsConfig.push('@commitlint/config-lerna-scopes');
      devDeps.push('@commitlint/config-lerna-scopes');
    }

    this.addFields({
      commitlint: {
        extends: extendsConfig,
      },
    });

    this.addDependencies({ devDeps });
  }
};
