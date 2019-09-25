import Generator from 'yeoman-generator';

export = class BaseGenerator extends Generator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected addFields(fields: Record<string, any>): void {
    this.fs.extendJSON(this.destinationPath('package.json'), fields);
  }

  protected addDependencies({
    deps = [],
    devDeps = [],
  }: {
    deps?: string[];
    devDeps?: string[];
  }): void {
    const dependencies: Record<string, string> = {};
    const devDependencies: Record<string, string> = {};

    deps.forEach(
      item => (dependencies[item] = `^${this.getPackageVersion(item)}`)
    );

    devDeps.forEach(
      item => (devDependencies[item] = `^${this.getPackageVersion(item)}`)
    );

    this.fs.extendJSON(this.destinationPath('package.json'), {
      dependencies,
      devDependencies,
    });
  }

  protected getStdoutString(cmd: string, args: string[]): string {
    const result = this.spawnCommandSync(cmd, args, {
      stdio: [process.stdout],
    });

    return Buffer.from(result.stdout)
      .toString()
      .slice(0, -1);
  }

  protected getPackageVersion(pkg: string): string {
    return this.getStdoutString('npm', ['show', pkg, 'version']);
  }
};
