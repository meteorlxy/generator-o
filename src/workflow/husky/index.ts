import BaseGenerator from '../../base-generator';

export = class HuskyGenerator extends BaseGenerator {
  private commitlint: boolean;

  private lintStaged: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('commitlint', {
      type: Boolean,
      default: false,
      description: 'use commitlint or not',
    });

    this.option('lintStaged', {
      type: Boolean,
      default: false,
      description: 'use lint-staged or not',
    });
  }

  initializing(): void {
    this.commitlint = this.options.commitlint;
    this.lintStaged = this.options.lintStaged;
  }

  writing(): void {
    // ======================
    // Generate config
    // ======================

    if (this.commitlint) {
      this.addFields({
        husky: {
          hooks: {
            'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
          },
        },
      });
    }

    if (this.lintStaged) {
      this.addFields({
        husky: {
          hooks: {
            'pre-commit': 'lint-staged',
          },
        },
      });
    }

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps: ['husky'] });
  }
};
