"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    this.log(yosay(`Creating rod:app`));
    this.composeWith(require.resolve("../package"));
  }

  writing() {}

  install() {
    this.installDependencies();
  }
};
