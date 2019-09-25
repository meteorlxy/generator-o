import BaseGenerator from '../../base-generator';

export = class EditorconfigGenerator extends BaseGenerator {
  writing(): void {
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    );
  }
};
