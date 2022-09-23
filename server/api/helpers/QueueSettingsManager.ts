import { WebhookClient } from "discord.js";
import { queues } from "../../../database";
import { IQueue } from "../../../src/types/queue";
import SendQueueUpdateWebhook from "../webhooks/SendQueueUpdateWebhook";

export class QueueSettingsManager {
  private queue: IQueue;

  constructor(queue: IQueue) {
    this.queue = queue;
  }

  async updateStatus(status: any) {
    if (typeof status != "boolean") status = this.queue.open;

    if (this.queue.open != status) {
      if (this.queue.webhook.notify.includes("queue:update")) {
        this.queue.open = status;

        SendQueueUpdateWebhook(this.queue);
      }
    }

    this.queue.open = status;

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateDescription(description: any) {
    if (typeof description != "string") description = this.queue.description;

    description.replace(/<script/g, "");

    this.queue.description = description;

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateModes(modes: any) {
    if (typeof modes != "object" || !modes.length || modes.length < 1)
      return {
        error: true,
        message: "You must provide at least one mode",
      };

    modes.splice(4, 99999);

    // ? Prevent numbers that aren't 0,1,2 or 3
    const sanitizedModes: number[] = [];
    for (let mode of modes) {
      if (!isNaN(Number(mode)) && mode < 4 && mode > -1) {
        sanitizedModes.push(Number(mode));
      }
    }

    this.queue.modes = sanitizedModes;

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateAdmins(admins: any, user: any) {
    if (!this.queue.isGroup)
      return {
        error: true,
        message: "This queue isn't a group!",
      };

    if (user._id != this.queue.owner)
      return {
        error: true,
        message: "This option is only avaliable for the group owner",
      };

    if (typeof admins != "object" || !admins.length || admins.length < 1)
      return {
        error: true,
        message: "You must provide at least one admin",
      };

    admins.splice(51, 99999);

    // ? Prevent numbers that aren't 0,1,2 or 3
    const sanitizedAdmins: string[] = [];
    for (let admin of admins) {
      if (!isNaN(Number(admin))) {
        sanitizedAdmins.push(admin);
      }
    }

    if (sanitizedAdmins.length < 1 || sanitizedAdmins.length > 50)
      return {
        error: true,
        message: "Max admins size is 50!",
      };

    this.queue.admins = sanitizedAdmins;

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateMetadata(metadata: any, user: any) {
    if (!this.queue.isGroup)
      return {
        error: true,
        message: "This queue isn't a group!",
      };

    if (user._id != this.queue.owner)
      return {
        error: true,
        message: "This option is only avaliable for the group owner",
      };

    if (typeof metadata != "object")
      return {
        error: true,
        message: "You must provide at least one admin",
      };

    const validImageKeys = ["icon", "banner"];
    const keys = Object.keys(metadata);

    for (const key of keys) {
      if (validImageKeys.includes(key)) {
        try {
          const url = new URL(metadata[key]);

          this.queue[key] = url.href;
        } catch (e) {
          return {
            error: true,
            message: `Invalid ${key} URL!`,
          };
        }
      }
    }

    if (metadata.name && metadata.name.trim() != "") {
      this.queue.name = metadata.name.trim();
    }

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateGenres(genres: any) {
    if (typeof genres != "object" || !genres.length || genres.length < 1)
      return {
        error: true,
        message: "You must provide at least one tag",
      };

    genres.splice(30, 99999);

    this.queue.genres = genres;

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateTimeClose(timeclose: any) {
    if (typeof timeclose != "object")
      return {
        error: true,
        message: "Invalid form body!",
      };

    if (
      !timeclose.size ||
      timeclose.size < 1 ||
      timeclose.size > 30 ||
      isNaN(Number(timeclose.size))
    )
      return {
        error: true,
        message: "Max schedule is 30 days!",
      };

    if (![true, false].includes(timeclose.enable))
      return {
        error: true,
        message: "Invalid enabled status provided!",
      };

    const date = new Date();
    date.setDate(date.getDay() + timeclose.size);

    this.queue.timeclose = {
      enable: timeclose.enable,
      size: timeclose.size,
      scheduled: date,
      validated: false,
    };

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateAutoClose(autoclose: any) {
    if (typeof autoclose != "object")
      return {
        error: true,
        message: "Invalid form body!",
      };

    if (
      !autoclose.size ||
      autoclose.size < 1 ||
      autoclose.size > 240 ||
      isNaN(Number(autoclose.size))
    )
      return {
        error: true,
        message: "Max size is 240 requests!",
      };

    if (![true, false].includes(autoclose.enable))
      return {
        error: true,
        message: "Invalid enabled status provided!",
      };

    this.queue.autoclose = {
      enable: autoclose.enable,
      size: autoclose.size,
    };

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateWebhook(webhook: any) {
    if (!this.queue.webhook) {
      this.queue.webhook = {
        url: "",
        notify: [],
      };
    }

    if (
      typeof webhook != "object" ||
      (webhook.url != "" && !webhook.url) ||
      !webhook.notify ||
      !webhook.notify.length
    )
      return {
        error: true,
        message: "Missing webhook URL or a scope!",
      };

    const validScopes = ["queue:update", "request:new", "request:update"];

    if (webhook.notify.length < 1 || webhook.notify.length > validScopes.length)
      return {
        error: true,
        message: "You need to add one scope!",
      };

    const sanitizedScopes: string[] = [];

    webhook.notify.forEach((scope) => {
      if (typeof scope != "string") return;

      if (!scope.trim().toLowerCase()) return;

      if (validScopes.includes(scope.trim().toLowerCase()))
        sanitizedScopes.push(scope.trim().toLowerCase());
    });

    if (
      sanitizedScopes.length < 1 ||
      sanitizedScopes.length > validScopes.length
    )
      return {
        error: true,
        message: "You need to add one scope!",
      };

    if (webhook.url.trim().toLowerCase() != "") {
      try {
        const validHosts = [
          "canary.discord.com",
          "beta.discord.com",
          "discord.com",
        ];
        const url = new URL(webhook.url);

        if (!validHosts.includes(url.hostname))
          return {
            error: true,
            message: "Only discord webhooks are supported!",
          };

        new WebhookClient({
          url: webhook.url,
        });
      } catch (e) {
        return {
          error: true,
          message: "Invalid webhook URL!",
        };
      }
    }

    this.queue.webhook = {
      url: webhook.url.trim(),
      notify: sanitizedScopes,
    };

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async updateFilters(filters: any) {
    if (typeof filters != "object") filters = this.queue.allow;

    if (
      typeof filters.graveyard != "boolean" ||
      typeof filters.wip != "boolean" ||
      typeof filters.cross != "boolean"
    )
      return {
        error: true,
        message:
          "Invalid filter value provided! Filter values need to be a Boolean",
      };

    this.queue.allow.graveyard = filters.graveyard;
    this.queue.allow.wip = filters.wip;
    this.queue.allow.cross = filters.cross;

    await this.save();

    return {
      error: false,
      message: "Saved!",
    };
  }

  async save() {
    const result = await queues.findByIdAndUpdate(this.queue._id, this.queue);

    return result;
  }
}
