import BaseGenerator from '../../base-generator';

export = class LintStagedGenerator extends BaseGenerator {
  private typescript: boolean;

  private vue: boolean;

  private eslint: boolean;

  private prettier: boolean;

  private sortPackageJson: boolean;

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

    this.option('eslint', {
      type: Boolean,
      default: false,
      description: 'use eslint or not',
    });

    this.option('prettier', {
      type: Boolean,
      default: false,
      description: 'use prettier or not',
    });

    this.option('sortPackageJson', {
      type: Boolean,
      default: false,
      description: 'use sort-package-json or not',
    });
  }

  initializing(): void {
    this.typescript = this.options.typescript;
    this.vue = this.options.vue;
    this.eslint = this.options.eslint;
    this.prettier = this.options.prettier;
    this.sortPackageJson = this.options.sortPackageJson;
  }

  writing(): void {
    // ======================
    // Generate config
    // ======================

    if (this.eslint) {
      const lintExts = ['js', 'jsx'];

      if (this.typescript) {
        lintExts.push('ts');
        lintExts.push('tsx');
      }

      if (this.vue) {
        lintExts.push('vue');
      }

      this.addFields({
        'lint-staged': {
          [`*.{${lintExts.join(',')}}`]: ['eslint --fix', 'git add'],
        },
      });
    }

    if (this.prettier) {
      this.addFields({
        'lint-staged': {
          '*.{json,md,yml}': ['prettier --write', 'git add'],
        },
      });
    }

    if (this.sortPackageJson) {
      this.addFields({
        'lint-staged': {
          'package.json': ['sort-package-json', 'git add'],
        },
      });
    }

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps: ['lint-staged'] });
  }
};
