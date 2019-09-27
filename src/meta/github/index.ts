import BaseGenerator from '../../base-generator';

export = class GithubGenerator extends BaseGenerator {
  protected pullRequestTemplate: boolean;

  protected issueTemplate: boolean;

  protected lockBot: boolean;

  protected staleBot: boolean;

  constructor(args, options) {
    super(args, options);

    this.option('pullRequestTemplate', {
      type: Boolean,
      default: true,
      description: 'add pull request temaplte or not',
    });

    this.option('issueTemplate', {
      type: Boolean,
      default: true,
      description: 'add issue temaplte or not',
    });

    this.option('lockBot', {
      type: Boolean,
      default: true,
      description: 'use lock bot or not',
    });

    this.option('staleBot', {
      type: Boolean,
      default: true,
      description: 'use stale bot or not',
    });
  }

  initializing(): void {
    this.pullRequestTemplate = this.options.pullRequestTemplate;
    this.issueTemplate = this.options.issueTemplate;
    this.lockBot = this.options.lockBot;
    this.staleBot = this.options.staleBot;
  }

  writing(): void {
    if (this.pullRequestTemplate) {
      this.fs.copy(
        this.templatePath('.github/PULL_REQUEST_TEMPLATE.md'),
        this.destinationPath('.github/PULL_REQUEST_TEMPLATE.md')
      );
    }

    if (this.issueTemplate) {
      this.fs.copy(
        this.templatePath('.github/ISSUE_TEMPLATE'),
        this.destinationPath('.github/ISSUE_TEMPLATE')
      );
    }

    if (this.lockBot) {
      this.fs.copy(
        this.templatePath('.github/lock.yml'),
        this.destinationPath('.github/lock.yml')
      );
    }

    if (this.staleBot) {
      this.fs.copy(
        this.templatePath('.github/stale.yml'),
        this.destinationPath('.github/stale.yml')
      );
    }
  }
};
