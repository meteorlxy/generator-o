import BaseGenerator from '../../base-generator';

export = class SortPackageJsonGenerator extends BaseGenerator {
  writing(): void {
    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps: ['sort-package-json'] });
  }
};
