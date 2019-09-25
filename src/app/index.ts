import path from 'path';
import BaseGenerator from '../base-generator';
import hasYarn from 'has-yarn';

const generatorRoot = path.resolve(__dirname, '../..');

const registryUrls = {
  npm: 'https://registry.npmjs.org',
  yarn: 'https://registry.yarnpkg.com',
  taobao: 'https://registry.npm.taobao.org',
};

export = class OGenerator extends BaseGenerator {
  private props: {
    packageManager: 'npm' | 'yarn';
    registry: 'default' | 'npm' | 'yarn' | 'taobao';
    template: 'base' | 'vue' | 'typescript' | 'typescript-vue';

    // languages
    vue: boolean;
    typescript: boolean;

    // meta files
    vscode: boolean;
    editorconfig: boolean;
    git: boolean;
    readme: boolean;
    license: boolean;

    // development workflow
    lerna: boolean;
    lernaVersionIndependent: boolean;
    commitlint: boolean;
    eslint: boolean;
    prettier: boolean;
    husky: boolean;
    lintStaged: boolean;
    sortPackageJson: boolean;
    changelog: boolean;

    // testing
    jest: boolean;
  };

  async prompting(): Promise<void> {
    const answers = await this.prompt([
      {
        type: 'confirm',
        name: 'lerna',
        message: 'Use lerna or not',
        default: true,
      },
      {
        type: 'confirm',
        name: 'lernaVersionIndependent',
        message: 'Use lerna independent mode nor not',
        default: false,
        when: (answers): boolean => answers.lerna,
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Select a package manager',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'yarn', value: 'yarn' },
        ],
        default: hasYarn(this.destinationRoot()) ? 'yarn' : 'npm',
      },
      {
        type: 'list',
        name: 'registry',
        message: 'Select a registry to use',
        choices: [
          { name: 'default', value: 'default' },
          { name: 'npm', value: 'npm' },
          { name: 'yarn', value: 'yarn' },
          { name: 'taobao', value: 'taobao' },
        ],
        default: 'default',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select a template to use',
        choices: [
          { name: 'Base', value: 'base' },
          { name: 'Vue', value: 'vue' },
          { name: 'Typescript', value: 'typescript' },
          { name: 'Typescript + Vue', value: 'typescript-vue' },
        ],
        default: 'Base',
      },
      {
        type: 'checkbox',
        name: 'meta',
        message: 'Select meta files you want to initialize',
        choices: [
          { name: 'VSCode settings', value: 'vscode' },
          { name: 'Editor config', value: 'editorconfig' },
          { name: 'Git meta files', value: 'git' },
          { name: 'LICENSE', value: 'license' },
          { name: 'README.md', value: 'readme' },
          { name: 'CHANGELOG', value: 'changelog' },
        ],
        default: [
          'vscode',
          'editorconfig',
          'git',
          'license',
          'readme',
          'changelog',
        ],
      },
      {
        type: 'checkbox',
        name: 'workflow',
        message: 'Select development workflow you want to initialize',
        choices: [
          { name: 'CommitLint', value: 'commitlint' },
          { name: 'ESLint', value: 'eslint' },
          { name: 'Prettier', value: 'prettier' },
          { name: 'Husky', value: 'husky' },
          { name: 'Lint staged', value: 'lint-staged' },
          { name: 'Sort package.json', value: 'sort-package-json' },
        ],
        default: [
          'commitlint',
          'eslint',
          'prettier',
          'husky',
          'lint-staged',
          'sort-package-json',
        ],
      },
      {
        type: 'checkbox',
        name: 'test',
        message: 'Select testing you want to initialize',
        choices: [{ name: 'Jest', value: 'jest' }],
        default: ['jest'],
      },
    ]);

    this.props = {
      // package
      packageManager: answers.packageManager,
      registry: answers.registry,

      // template
      template: answers.template,
      vue: ['vue', 'typescript-vue'].includes(answers.template),
      typescript: ['typescript', 'typescript-vue'].includes(answers.template),

      // meta
      vscode: answers.meta.includes('vscode'),
      editorconfig: answers.meta.includes('editorconfig'),
      git: answers.meta.includes('git'),
      readme: answers.meta.includes('readme'),
      license: answers.meta.includes('license'),

      // workflow
      lerna: answers.lerna,
      lernaVersionIndependent: answers.lernaVersionIndependent,
      commitlint: answers.workflow.includes('commitlint'),
      eslint: answers.workflow.includes('eslint'),
      prettier: answers.workflow.includes('prettier'),
      husky: answers.workflow.includes('husky'),
      lintStaged: answers.workflow.includes('lint-staged'),
      sortPackageJson: answers.workflow.includes('sort-package-json'),
      changelog: answers.workflow.includes('changelog'),

      // testing
      jest: answers.test.includes('jest'),
    };
  }

  default(): void {
    // ==================================
    // meta files
    // ==================================

    this.composeWith(require.resolve('../meta/npmrc'), {
      registry: registryUrls[this.props.registry],
      proxy: '',
    });

    if (this.props.vscode) {
      this.composeWith(require.resolve('../meta/vscode'), {
        typescript: this.props.typescript,
        vue: this.props.vue,
      });
    }

    if (this.props.editorconfig) {
      this.composeWith(require.resolve('../meta/editorconfig'), {});
    }

    if (this.props.git) {
      this.composeWith(require.resolve('../meta/git'), {
        packageManager: this.props.packageManager,
        typescript: this.props.typescript,
        coverage: this.props.jest,
      });
    }

    if (this.props.license) {
      this.composeWith(require.resolve('generator-license'), {
        name: this.user.git.name(),
        email: this.user.git.email(),
        website: '',
        defaultLicense: 'MIT',
      });
    }

    if (this.props.readme) {
      this.composeWith(require.resolve('../meta/readme'), {
        username: this.user.git.name(),
        // TODO: project info & license type
        projectName: '',
        projectDesc: '',
        license: 'MIT',
      });
    }

    // ==================================
    // workflow
    // ==================================

    if (this.props.lerna) {
      this.composeWith(require.resolve('../workflow/lerna'), {
        packageManager: this.props.packageManager,
        independent: this.props.lernaVersionIndependent,
        registry: registryUrls[this.props.registry],
      });
    }

    if (this.props.commitlint) {
      this.composeWith(require.resolve('../workflow/commitlint'), {
        lerna: this.props.lerna,
      });
    }

    if (this.props.eslint) {
      this.composeWith(require.resolve('../workflow/eslint'), {
        lerna: this.props.lerna,
        typescript: this.props.typescript,
        vue: this.props.vue,
        prettier: this.props.prettier,
        test: this.props.jest,
      });
    }

    if (this.props.prettier) {
      this.composeWith(require.resolve('../workflow/prettier'), {});
    }

    if (this.props.husky) {
      this.composeWith(require.resolve('../workflow/husky'), {
        commitlint: this.props.commitlint,
        lintStaged: this.props.lintStaged,
      });
    }

    if (this.props.lintStaged) {
      this.composeWith(require.resolve('../workflow/lint-staged'), {
        typescript: this.props.typescript,
        vue: this.props.vue,
        eslint: this.props.eslint,
        prettier: this.props.prettier,
        sortPackageJson: this.props.sortPackageJson,
      });
    }

    if (this.props.sortPackageJson) {
      this.composeWith(require.resolve('../workflow/sort-package-json'), {});
    }

    if (this.props.changelog) {
      this.composeWith(
        require.resolve('../workflow/conventional-changelog'),
        {}
      );
    }

    // ==================================
    // testing
    // ==================================

    if (this.props.jest) {
      this.composeWith(require.resolve('../test/jest'), {
        typescript: this.props.typescript,
        vue: this.props.vue,
        eslint: this.props.eslint,
      });
    }
  }

  install(): void {
    this.spawnCommandSync(
      'node',
      [
        'node_modules/.bin/sort-package-json',
        this.destinationPath('package.json'),
      ],
      {
        cwd: generatorRoot,
      }
    );

    if (this.props.packageManager === 'npm') {
      this.npmInstall();
    } else if (this.props.packageManager === 'yarn') {
      this.yarnInstall();
    }
  }
};
