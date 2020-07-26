"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("packageFull", {
      description: "Package name with scope",
      required: false,
      type: String
    });
  }

  async prompting() {
    if (this.options.packageFull) {
      const full = this.options.packageFull;
      const [scope, name] = full.replace("@", "").split("/");
      this.package = { full, scope, name, description: "" };
      return;
    }

    // Have Yeoman greet the user.
    this.log(yosay(`Creating rod:package`));

    const prompts = [
      {
        type: "input",
        name: "scope",
        message: "Scope"
      },
      {
        type: "input",
        name: "name",
        message: "Package name"
      },
      {
        type: "input",
        name: "description",
        message: "Package description"
      }
    ];

    this.package = await this.prompt(prompts);
    this.package.full = `@${this.package.scope}/${this.package.name}`;
  }

  paths() {
    this.destinationRoot(`packages/${this.package.name}/`);
  }

  writing() {
    this.fs.copy(
      this.templatePath("jest.config.js.ejs"),
      this.destinationPath("jest.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("package.json.ejs"),
      this.destinationPath("package.json"),
      { package: this.package }
    );
    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      { package: this.package }
    );
    this.fs.copy(
      this.templatePath("tsconfig.json.ejs"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copy(
      this.templatePath("src/example.ts.ejs"),
      this.destinationPath(`src/${this.package.name}.ts`)
    );
    this.fs.copy(
      this.templatePath("src/example.test.ts.ejs"),
      this.destinationPath(`src/${this.package.name}.test.ts`)
    );
  }

  install() {
    this.installDependencies({ yarn: true, npm: false, bower: false });
  }
};
