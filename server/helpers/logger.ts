import "colors";
import { Request } from "express";

export function consoleLog(
  module_name: string,
  message: string,
  req?: Request
) {
  console.log(
    `[${new Date().toLocaleString()}] ${
      req
        ? `<${req.headers["x-forwarded-for"] || req.connection.remoteAddress}>`
        : ""
    } || ` + `[${module_name}]`.bgYellow.black.concat(message.bgBlue.black)
  );
}

export function consoleError(
  module_name: string,
  message: string,
  req?: Request
) {
  console.log(
    `[${new Date().toLocaleString()}] ${
      req
        ? `<${req.headers["x-forwarded-for"] || req.connection.remoteAddress}>`
        : ""
    } || ` + `[${module_name}]`.bgYellow.black.concat(message.bgRed.black)
  );
}

export function consoleCheck(
  module_name: string,
  message: string,
  req?: Request
) {
  console.log(
    `[${new Date().toLocaleString()}] ${
      req
        ? `<${req.headers["x-forwarded-for"] || req.connection.remoteAddress}>`
        : ""
    } || ` + `[${module_name}]`.bgYellow.black.concat(message.bgGreen.black)
  );
}
