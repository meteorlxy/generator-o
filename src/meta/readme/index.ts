import BaseGenerator from '../../base-generator';

export = class ReadmeGenerator extends BaseGenerator {
  private username: string;

  private projectName: string;

  private projectDesc: string;

  private license: string;

  constructor(args, options) {
    super(args, options);

    this.option('username', {
      type: String,
      default: this.user.git.name(),
      description: 'username',
    });

    this.option('projectName', {
      type: String,
      default: '',
      description: 'project name',
    });

    this.option('projectDesc', {
      type: String,
      default: '',
      description: 'project description',
    });

    this.option('license', {
      type: String,
      default: 'MIT',
      description: 'license',
    });
  }

  initializing(): void {
    this.username = this.options.username;
    this.projectName = this.options.projectName;
    this.projectDesc = this.options.projectDesc;
    this.license = this.options.license;
  }

  writing(): void {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        username: this.username,
        projectName: this.projectName,
        projectDesc: this.projectDesc,
        license: this.license,
      }
    );
  }
};
