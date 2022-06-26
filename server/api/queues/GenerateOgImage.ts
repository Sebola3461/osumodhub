import { Request, Response } from "express";
import jimp from "jimp";
import { resolve } from "path";
import { queues } from "../../../database";

export default async (req: Request, res: Response) => {
  try {
    const queue_id = req.params.id;

    const queue = await queues.findById(queue_id);

    if (queue == null) return res.status(404).send();

    const sizes = {
      avatar: {
        w: 200,
        h: 200,
      },
    };

    // ? Background
    const banner = await jimp.read(queue.banner);
    const bannerClone = banner.clone();
    banner.resize(1280, 720);

    const ratio = getCoverSize(
      bannerClone.getWidth(),
      bannerClone.getHeight(),
      1280,
      720
    );
    bannerClone.resize(ratio.width, ratio.height);

    const scale = Math.min(1280 / banner.getWidth(), 720 / banner.getHeight());
    const w = banner.getWidth() * scale;
    const h = banner.getHeight() * scale;
    banner.composite(bannerClone, 1280 / 2 - w / 2, 720 / 2 - h / 2);

    // ? Background gradient
    const gradient = await jimp.read(
      __dirname != undefined
        ? resolve(__dirname + `/../../files/png/gradient.png`)
        : `./server/files/png/gradient.png`
    );
    gradient.resize(1280, 720);
    banner.composite(gradient, 0, 0);

    // ? Avatar
    const avatar = await jimp.read(`https://a.ppy.sh/${queue_id}`);
    avatar.resize(sizes.avatar.w, sizes.avatar.h);

    const avatarMask = await jimp.read(
      __dirname != undefined
        ? resolve(__dirname + "/../../files/png/round_mask.png")
        : "./server/files/png/round_mask.png"
    );
    avatarMask.resize(sizes.avatar.w, sizes.avatar.h);
    avatar.mask(avatarMask, 0, 0);
    banner.composite(avatar, 100, 100);

    // ? Name
    const message = queue.name;
    let x = 100;
    let y = 320;

    const font = await jimp.loadFont(
      __dirname != undefined
        ? resolve(__dirname + "/../../files/font/quicksand.fnt")
        : "./server/files/font/quicksand.fnt"
    );
    banner.print(font, x, y, message);

    // ? Type
    const type = await jimp.read(
      __dirname != undefined
        ? resolve(
            __dirname + `/../../files/png/${queue.type}tag.png`.toLowerCase()
          )
        : `./server/files/png/${queue.type}tag.png`.toLowerCase()
    );
    type.resize(300, 300);
    banner.composite(type, 48, 300);

    // ? Status
    const status = await jimp.read(
      __dirname != undefined
        ? resolve(
            __dirname + `/../../files/png/${queue.open ? "open" : "closed"}.png`
          )
        : `./server/files/png/${queue.open ? "open" : "closed"}.png`
    );
    status.resize(300, 300);
    banner.composite(status, 900, 0);

    // ? Send
    res.setHeader("content-type", "image/png");
    const buffer = await banner.getBufferAsync("image/png");
    res.send(buffer);

    function getCoverSize(
      imgWidth: number,
      imgHeight: number,
      containerWidth: number,
      containerHeight: number
    ) {
      const imgRatio = imgHeight / imgWidth; // original img ratio
      const containerRatio = containerHeight / containerWidth; // container ratio

      let finalWidth = 0;
      let finalHeight = 0;

      if (containerRatio > imgRatio) {
        finalHeight = containerHeight;
        finalWidth = containerHeight / imgRatio;
      } else {
        finalWidth = containerWidth;
        finalHeight = containerWidth / imgRatio;
      }

      return {
        width: finalWidth,
        height: finalHeight,
      };
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};
