import BaseGenerator from '../../base-generator';

export = class ConventionalChangelogGenerator extends BaseGenerator {
  writing(): void {
    // ======================
    // Generate config
    // ======================

    this.addFields({
      scripts: {
        version:
          'conventional-changelog -p angular -i CHANGELOG.md -s -r 1 && git add CHANGELOG.md',
        publish: 'git push origin master:master --tags',
      },
    });

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps: ['conventional-changelog-cli'] });
  }
};
