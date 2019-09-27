import BaseGenerator from '../../base-generator';

export = class JestGenerator extends BaseGenerator {
  protected typescript: boolean;

  protected vue: boolean;

  protected eslint: boolean;

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
  }

  initializing(): void {
    this.typescript = this.options.typescript;
    this.vue = this.options.vue;
    this.eslint = this.options.eslint;
  }

  writing(): void {
    // ======================
    // Generate config
    // ======================

    const devDeps = ['jest', '@types/jest'];

    this.fs.copyTpl(
      this.templatePath('jest.config.ejs'),
      this.destinationPath('jest.config.js'),
      {
        typescript: this.typescript,
        vue: this.vue,
      }
    );

    if (this.typescript) {
      devDeps.push('ts-jest');

      this.fs.copy(
        this.templatePath('test/tsconfig.json'),
        this.destinationPath('test/tsconfig.json')
      );
    }

    if (this.vue) {
      devDeps.push('vue-jest');
      devDeps.push('jest-serializer-vue');
      devDeps.push('jest-transform-stub');
      devDeps.push('@vue/test-utils');

      if (!this.typescript) {
        devDeps.push('babel-jest');
      }

      this.fs.copy(
        this.templatePath('test/setup.js'),
        this.destinationPath('test/setup.js')
      );
    }

    if (this.eslint) {
      devDeps.push('eslint-plugin-jest');
      devDeps.push('eslint-import-resolver-alias');

      this.fs.copyTpl(
        this.templatePath('test/.eslintrc.ejs'),
        this.destinationPath('test/.eslintrc.js'),
        {
          typescript: this.typescript,
          vue: this.vue,
        }
      );
    }

    this.addFields({
      scripts: {
        test: 'jest',
      },
    });

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps });
  }
};
