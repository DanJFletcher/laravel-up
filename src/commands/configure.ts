import { Command, flags } from "@oclif/command";
import * as envfile from "envfile";
import * as inquirer from "inquirer";
import {
  displayCommandHeader,
  promptEnvironment,
  testTargetDirectory,
  publishEnvironment
} from "../actions";
import chalk from "chalk";

export default class Configure extends Command {
  static description =
    "Configures an existing vanilla Laravel app as an Up project";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [];

  async run() {
    // const pwd = shelljs.pwd().toString();
    const pwd = "/home/jesse/code/laravel-tests/vanilla1";

    displayCommandHeader(
      "This will guide you through configuration of an existing vanilla Laravel application to be used as an Up project"
    );

    const mainPrompt = await inquirer.prompt([
      {
        default: pwd,
        name: "location",
        message:
          "Where is the Laravel app you would like to configure? (Defaults to current directory)",
        type: "input"
      }
    ]);

    const { location } = mainPrompt;

    if (!testTargetDirectory(location)) {
      return;
    }

    console.log(
      chalk.yellow(
        "This process will make changes to the file system of your project."
      )
    );
    console.log(
      chalk.yellow(
        "It is highly recommended that you do this after committing or stashing all working changes so you can revert with git if needed."
      )
    );

    const areYouSure = await inquirer.prompt([
      {
        message: "Are you sure you would like to do this?",
        name: "confirm",
        type: "confirm"
      }
    ]);

    if (areYouSure.confirm !== true) {
      return;
    }

    const envConfig = await promptEnvironment();

    await publishEnvironment(location, envConfig);

    console.log(
      chalk.green("Your project is ready! Just run `lvl up` to start it")
    );
  }
}
