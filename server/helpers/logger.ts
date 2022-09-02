import "colors";
import { Request } from "express";

export function consoleLog(
  module_name: string,
  message: string,
  req?: Request
) {
  console.log(
    `${new Date().toLocaleString()} => <${req?.headers["X-Real-IP"]}> ||` +
      `[${module_name}]`.bgYellow.black.concat(message.bgBlue.black)
  );
}

export function consoleError(
  module_name: string,
  message: string,
  req?: Request
) {
  console.log(
    `${new Date().toLocaleString()} => <${req?.headers["X-Real-IP"]}> ||` +
      `[${module_name}]`.bgYellow.black.concat(message.bgRed.black)
  );
}

export function consoleCheck(
  module_name: string,
  message: string,
  req?: Request
) {
  console.log(
    `${new Date().toLocaleString()} => <${req?.headers["X-Real-IP"]}> ||` +
      `[${module_name}]`.bgYellow.black.concat(message.bgGreen.black)
  );
}
