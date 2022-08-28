import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import notifyFollowers from "../helpers/notifyFollowers";
import SendQueueUpdateWebhook from "../webhooks/SendQueueUpdateWebhook";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const queue_owner = await users.findOne({ account_token: authorization });

  if (queue_owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  const queue = await queues.findById(queue_owner._id);

  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  if (authorization != queue_owner.account_token)
    return res.status(400).send({
      status: 401,
      message: "Unauthorized",
    });

  const editable = ["description", "open", "modes", "allow"];
  const _queue = Object.keys(req.body);

  // ? Update queue settings
  for (const opt of _queue) {
    if (editable.includes(opt)) {
      // ? Open/Close queue
      if (
        req.body.open != null &&
        req.body.open != undefined &&
        typeof req.body.open == "boolean"
      ) {
        if (queue.open == false && Boolean(req.body.open) == true) {
          SendQueueUpdateWebhook(queue);
          notifyFollowers(queue);
        }

        queue.open = Boolean(req.body.open);
      }

      // ? Update description
      if (req.body.description && typeof req.body.description == "string") {
        queue.description = req.body.description;
      }

      // ? Update description
      if (req.body.webhook && typeof req.body.webhook == "object") {
        const isValidWebhook = validateWebhook(req.body.webhook);

        if (isValidWebhook.valid) {
          queue.webhook = {
            url: isValidWebhook.url,
            notify: isValidWebhook.tags,
          };
        }
      }

      // ? Update genres
      if (
        req.body.genres &&
        typeof req.body.genres == "object" &&
        req.body.genres.length != 0
      ) {
        const clearGenres: string[] = [];
        req.body.genres.splice(35, 9999);

        req.body.genres.forEach((genre) => {
          if (typeof genre == "string") clearGenres.push(genre);
        });

        queue.genres = clearGenres;
      }

      // ? Update autoclose
      if (req.body.autoclose && typeof req.body.autoclose == "object") {
        if (typeof req.body.autoclose.enable == "boolean") {
          queue.autoclose.enable = req.body.autoclose.enable;
        }

        if (typeof req.body.autoclose.size == "number") {
          queue.autoclose.size = req.body.autoclose.size;
        }
      }

      // ? Update allow settings
      if (req.body.allow && typeof req.body.allow == "object") {
        queue.allow = {
          wip:
            typeof Boolean(req.body.allow.wip) == "boolean"
              ? Boolean(req.body.allow.wip)
              : queue.allow.wip,
          graveyard:
            typeof req.body.allow.graveyard == "boolean"
              ? req.body.allow.graveyard
              : queue.allow.graveyard,
          cross:
            typeof req.body.allow.cross == "boolean"
              ? req.body.allow.cross
              : queue.allow.cross,
        };
      }

      // ? Update timeclose settings
      if (req.body.timeclose && typeof req.body.timeclose == "object") {
        queue.timeclose.enable =
          typeof Boolean(req.body.timeclose.enable) == "boolean"
            ? Boolean(req.body.timeclose.enable)
            : queue.timeclose.enable;

        if (
          typeof req.body.timeclose.size == "number" &&
          req.body.timeclose.size > 0 &&
          req.body.timeclose.size < 32
        ) {
          queue.timeclose.size = req.body.timeclose.size;
        }
      }

      // ? Update modes
      if (req.body.modes && typeof req.body.modes == "object") {
        if (req.body.modes.length < 5 && req.body.modes.length != 0) {
          const validModes = [0, 1, 2, 3];
          const clearModes: number[] = [];

          req.body.modes.forEach((m: any) => {
            if (validModes.includes(Number(m))) {
              if (!clearModes.includes(m) && !isNaN(Number(m)))
                clearModes.push(Number(m));
            }
          });

          queue["modes"] = clearModes;
        }
      }
    }
  }

  function validateWebhook(webhook: any) {
    try {
      let validTags = ["request:update", "request:new", "queue:state"];

      if (!webhook.url && webhook.url == "")
        return {
          valid: false,
          tags: [""],
          url: "",
        };
      if (!webhook.notify.length)
        return {
          valid: false,
          tags: [""],
          url: "",
        };
      let hasValidTags = false;
      let sanitizedTags: string[] = [];

      webhook.notify.forEach((t) => {
        t = t.toString().trim().toLowerCase();

        // ? Sanitize tags
        if (validTags.includes(t)) {
          sanitizedTags.push(t);
          hasValidTags = true;
        }
      });

      if (!hasValidTags)
        return {
          valid: false,
          tags: [""],
          url: "",
        };

      const webhookURL = new URL(webhook.url);

      if (webhookURL.host != "discord.com")
        return {
          valid: false,
          tags: [""],
          url: "",
        };

      if (webhookURL.pathname.split("/").length != 5)
        return {
          valid: false,
          tags: [""],
          url: "",
        };

      if (webhook.url == "")
        return {
          valid: true,
          tags: sanitizedTags,
          url: "",
        };
      if (
        webhookURL.pathname.split("/")[1] != "api" ||
        webhookURL.pathname.split("/")[2] != "webhooks" ||
        isNaN(Number(webhookURL.pathname.split("/")[3]))
      )
        return {
          valid: false,
          tags: [""],
          url: "",
        };

      return {
        valid: true,
        tags: sanitizedTags,
        url: webhookURL.href,
      };
    } catch (e) {
      return {
        valid: false,
        tags: [""],
        url: "",
      };
    }
  }

  await queues.findByIdAndUpdate(queue._id, queue);

  res.status(200).send({
    status: 200,
    message: "Queue updated!",
  });
};
