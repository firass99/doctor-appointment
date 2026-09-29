import chalk from "chalk";

export const logger = {
  success: (msg) => console.log(chalk.green.bold("✔"), chalk.green(msg)),
  info: (msg) => console.log(chalk.blue.bold("ℹ"), chalk.blue(msg)),
  warn: (msg) => console.log(chalk.yellow.bold("⚠"), chalk.yellow(msg)),
  error: (msg) => console.error(chalk.red.bold("✖"), chalk.red(msg)),
};
