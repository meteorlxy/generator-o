import BaseGenerator from '../../base-generator';

export = class PrettierGenerator extends BaseGenerator {
  writing(): void {
    // ======================
    // Generate config
    // ======================

    this.addFields({
      prettier: {
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
    });

    // ======================
    // Add devDependencies
    // ======================

    this.addDependencies({ devDeps: ['prettier'] });
  }
};
