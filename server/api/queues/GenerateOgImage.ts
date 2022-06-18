import { Request, Response } from "express";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import { queues } from "../../../database";

// Get dynamic font size for title depending on its length
function getFontSize(title = "") {
  if (!title || typeof title !== "string") return "";
  const titleLength = title.length;
  if (titleLength > 55) return "2.75rem";
  if (titleLength > 35) return "3.25rem";
  if (titleLength > 25) return "4.25rem";
  return "4.75rem";
}

export default async (req: Request, res: Response) => {
  const id = req.params.id;

  const queue = await queues.findById(id);

  if (!queue) return res.status(404);

  const templateHTML = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");
  
        * {
          font-family: "Quicksand", sans-serif;
        }
  
        body {
          width: 1280px;
          height: 500px;
          background-position: center;
          background-size: cover;
        }
  
        .left {
          height: 100%;
          width: 140px;
          display: flex;
          margin-left: 80px;
          flex-direction: column;
          flex-wrap: nowrap;
          align-content: center;
          justify-content: flex-start;
          align-items: center;
          margin-top: 70px;
        }
  
        .avatar {
          width: 140px;
          height: 140px;
          background-position: center;
          background-size: cover;
          border-radius: 1rem;
        }
  
        .name {
          font-size: 40px;
          margin: 10px;
          color: white;
        }
  
        .status {
          position: absolute;
          top: 80px;
          right: 80px;
          font-size: 40px;
          color: white;
          background: #25ca6a;
          padding: 5px 40px;
          border-radius: 1000px;
        }
  
        .status.closed {
          background: #c52d2d;
        }
  
        .tag {
          font-size: 20px;
          color: white;
          width: fit-content;
          border-radius: 1000px;
          padding: 5px 20px;
        }
  
        .tag.modder {
          background: #2196f3;
        }
  
        .tag.NAT {
          background: #eb8c47;
        }
  
        .tag.BN {
          background: #a347eb;
        }
  
        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: linear-gradient(90deg, black, transparent);
        }
      </style>
    </head>
    <body
      id="body"
      style="
        background-image: url(${queue.banner});
      "
    >
      <div class="background"></div>
      <div class="left">
        <div
          class="avatar"
          style="background-image: url(https://a.ppy.sh/${queue._id})"
        ></div>
        <div class="name">${queue.name}</div>
        <div class="tag ${queue.type}">${queue.type}</div>
        <div class="status ${queue.open ? "open" : "closed"}">${
    queue.open ? "open" : "closed"
  }</div>
      </div>
    </body>
  </html>

`;

  // Launch Headless browser and capture creenshot
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 1200,
      height: 720,
    },
  });

  const page = await browser.newPage();
  // Set the content to our rendered HTML
  await page.setContent(templateHTML, { waitUntil: "load" });

  const element = await page.$("html");
  const image = await element?.screenshot({ omitBackground: false });
  await browser.close();

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Cache-Control": `immutable, no-transform, s-max-age=2592000, max-age=2592000`,
  });
  res.end(image);
};
