import { APIApplicationCommandPermissionsConstant } from "discord.js";
import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import notifyFollowers from "../helpers/notifyFollowers";
import SendQueueUpdateWebhook from "../webhooks/SendQueueUpdateWebhook";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const group = req.params.id;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const manager = await users.findOne({ account_token: authorization });

  if (manager == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  const groupData = await queues.findById(group);

  if (groupData == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  if (!groupData.isGroup)
    return res.status(403).send({
      status: 403,
      message: "This queue isn't a group!",
    });

  if (manager._id != groupData.owner && !groupData.admins.includes(manager._id))
    return res.status(403).send({
      status: 403,
      message: "Missing permissions",
    });

  if (authorization != manager.account_token)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  const editable = [
    "name",
    "icon",
    "banner",
    "admins",
    "description",
    "open",
    "modes",
    "allow",
    "webhook",
  ];
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
        if (groupData.open == false && Boolean(req.body.open) == true) {
          notifyFollowers(groupData);
        }

        if (groupData.open != Boolean(req.body.open)) {
          groupData.open = Boolean(req.body.open);
          SendQueueUpdateWebhook(groupData);
        }

        groupData.open = Boolean(req.body.open);
      }

      // ? Update description
      if (req.body.description && typeof req.body.description == "string") {
        groupData.description = req.body.description;
      }

      // ? Update name
      if (req.body.name && typeof req.body.name == "string") {
        groupData.name = req.body.name;
      }

      // ? Update icon
      if (req.body.icon && typeof req.body.icon == "string") {
        groupData.icon = req.body.icon;
      }

      // ? Update banner
      if (req.body.banner && typeof req.body.banner == "string") {
        groupData.banner = req.body.banner;
      }

      // ? Update webhook
      if (req.body.webhook && typeof req.body.webhook == "object") {
        const isValidWebhook = validateWebhook(req.body.webhook);

        if (isValidWebhook.valid) {
          groupData.webhook = {
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

        groupData.genres = clearGenres;
      }

      // ? Update autoclose
      if (req.body.autoclose && typeof req.body.autoclose == "object") {
        if (typeof req.body.autoclose.enable == "boolean") {
          groupData.autoclose.enable = req.body.autoclose.enable;
        }

        if (typeof req.body.autoclose.size == "number") {
          groupData.autoclose.size = req.body.autoclose.size;
        }
      }

      // ? Update allow settings
      if (req.body.allow && typeof req.body.allow == "object") {
        groupData.allow = {
          wip:
            typeof Boolean(req.body.allow.wip) == "boolean"
              ? Boolean(req.body.allow.wip)
              : groupData.allow.wip,
          graveyard:
            typeof req.body.allow.graveyard == "boolean"
              ? req.body.allow.graveyard
              : groupData.allow.graveyard,
          cross:
            typeof req.body.allow.cross == "boolean"
              ? req.body.allow.cross
              : groupData.allow.cross,
        };
      }

      // ? Update timeclose settings
      if (req.body.timeclose && typeof req.body.timeclose == "object") {
        groupData.timeclose.enable =
          typeof Boolean(req.body.timeclose.enable) == "boolean"
            ? Boolean(req.body.timeclose.enable)
            : groupData.timeclose.enable;

        if (
          typeof req.body.timeclose.size == "number" &&
          req.body.timeclose.size > 0 &&
          req.body.timeclose.size < 32
        ) {
          groupData.timeclose.size = req.body.timeclose.size;
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

          groupData["modes"] = clearModes;
        }
      }
    }
  }

  // ? Modify admins out of the loop to prevent dup
  if (
    req.body.admins &&
    typeof req.body.admins == "object" &&
    req.body.admins.length != 0
  ) {
    const clearAdmins: string[] = [];
    req.body.admins.splice(20, 9999);

    if (req.body.admins.length > 1) {
      for (const admin of req.body.admins) {
        if (typeof admin == "string") {
          const user = await users.findById(admin);

          if (user && user._id != groupData.owner) {
            clearAdmins.push(admin);
            groupData.admins = clearAdmins;
          }
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

  await queues.findByIdAndUpdate(groupData._id, groupData);

  res.status(200).send({
    status: 200,
    message: "Queue updated!",
  });
};
