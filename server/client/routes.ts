import { Request, Response, Router } from "express";
import path from "path";

const client = Router();

client.get("/", sendHTML);
client.get("/queue/:queue", sendHTML);

function sendHTML(req: Request, res: Response) {
  res
    .status(200)
    .sendFile(path.resolve(__dirname.concat("/../../dist/index.html")));
}

export const ClientRoutes = client;
