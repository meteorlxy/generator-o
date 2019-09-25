import BaseGenerator from '../../base-generator';

export = class LernaGenerator extends BaseGenerator {
  private packageManager: 'npm' | 'yarn';

  private independent: boolean;

  private registry: string;

  private changelog: boolean;

  private test: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('packageManager', {
      type: String,
      default: 'yarn',
      description: 'package manager to use',
    });

    this.option('independent', {
      type: Boolean,
      default: false,
      description: 'independent mode or not',
    });

    this.option('registry', {
      type: String,
      default: 'https://registry.npmjs.org',
      description: 'registry to publish',
    });

    this.option('changelog', {
      type: Boolean,
      default: false,
      description: 'add changelog or not',
    });

    this.option('test', {
      type: Boolean,
      default: false,
      description: 'has test or not',
    });
  }

  initializing(): void {
    this.packageManager = this.options.packageManager;
    this.independent = this.options.independent;
    this.registry = this.options.registry;
    this.changelog = this.options.changelog;
    this.test = this.options.test;
  }

  writing(): void {
    // ======================
    // Generate config
    // ======================

    this.fs.copyTpl(
      this.templatePath('lerna.ejs'),
      this.destinationPath('lerna.json'),
      {
        packageManager: this.packageManager,
        versionIndependent: this.independent,
        registry: this.registry,
        changelog: this.changelog,
        test: this.test,
      }
    );

    if (this.packageManager === 'npm') {
      this.addFields({
        private: true,
        scripts: {
          bootstrap: `lerna bootstrap`,
        },
      });
    } else {
      this.addFields({
        private: true,
        workspaces: ['packages/*'],
      });
    }

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({
      devDeps: ['lerna'],
    });
  }
};
