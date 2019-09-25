import BaseGenerator from '../../base-generator';

export = class LernaGenerator extends BaseGenerator {
  private packageManager: 'npm' | 'yarn';

  private independent: boolean;

  private registry: string;

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
  }

  initializing(): void {
    this.packageManager = this.options.packageManager;
    this.independent = this.options.independent;
    this.registry = this.options.registry;
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
