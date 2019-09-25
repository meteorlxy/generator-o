import BaseGenerator from '../../base-generator';

export = class EslintGenerator extends BaseGenerator {
  private lerna: boolean;

  private typescript: boolean;

  private vue: boolean;

  private prettier: boolean;

  private test: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('lerna', {
      type: Boolean,
      default: false,
      description: 'use lerna or not',
    });

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

    this.option('prettier', {
      type: Boolean,
      default: false,
      description: 'use prettier or not',
    });

    this.option('test', {
      type: Boolean,
      default: false,
      description: 'have test or not',
    });
  }

  initializing(): void {
    this.lerna = this.options.lerna;
    this.typescript = this.options.typescript;
    this.vue = this.options.vue;
    this.prettier = this.options.prettier;
    this.test = this.options.test;
  }

  writing(): void {
    // ======================
    // Generate config
    // ======================

    const extendsConfig = ['standard'];
    const devDeps = [
      'eslint',
      'eslint-config-standard',
      'eslint-plugin-import',
      'eslint-plugin-node',
      'eslint-plugin-promise',
      'eslint-plugin-standard',
    ];
    const exts = ['.js', '.jsx'];
    const lintDirs = [
      this.lerna ? 'packages' : this.vue || this.typescript ? 'src' : 'lib',
    ];

    if (this.typescript) {
      extendsConfig.push('plugin:@typescript-eslint/recommended');
      extendsConfig.push('plugin:import/typescript');
      devDeps.push('@typescript-eslint/eslint-plugin');
      devDeps.push('@typescript-eslint/parser');
      exts.push('.ts');
      exts.push('.tsx');
    }

    if (this.vue) {
      extendsConfig.push('plugin:vue/recommended');
      devDeps.push('eslint-plugin-vue');
      exts.push('.vue');
      if (!this.typescript) {
        devDeps.push('babel-eslint');
      }
    }

    if (this.prettier) {
      extendsConfig.push('prettier');
      extendsConfig.push('prettier/standard');
      devDeps.push('eslint-config-prettier');
      devDeps.push('eslint-plugin-prettier');
      if (this.typescript) {
        extendsConfig.push('prettier/@typescript-eslint');
      }
      if (this.vue) {
        extendsConfig.push('prettier/vue');
      }
    }

    if (this.test) {
      lintDirs.push('test');
    }

    this.fs.copyTpl(
      this.templatePath('.eslintrc.ejs'),
      this.destinationPath('.eslintrc.js'),
      {
        extendsConfig,
        vue: this.vue,
        typescript: this.typescript,
        prettier: this.prettier,
        exts,
      }
    );

    this.addFields({
      scripts: {
        lint: `eslint --ext ${exts.join(',')} ${lintDirs.join(' ')}`,
      },
    });

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps });
  }
};
