import { WebhookClient } from "discord.js";
import { users } from "../../../database";
import { IQueue } from "../../../src/types/queue";
import SendQueueUpdateWebhook from "../webhooks/SendQueueUpdateWebhook";

export class UserSettingsManager {
  private user: any;

  constructor(user: any) {
    this.user = user;
  }

  async updateColor(color: string) {
    if (
      !/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color) &&
      !/^rgb\s*(\s*[012]?[0-9]{1,2}\s*,\s*[012]?[0-9]{1,2}\s*,\s*[012]?[0-9]{1,2}\s*)$/i.test(
        color
      )
    )
      return {
        error: true,
        message:
          "Invalid color provided! Only RGB and HEX colors are accepted.",
      };

    color = color.trim().toLowerCase();

    this.user.color = color;

    await this.save();

    return { error: false, message: "Saved!" };
  }

  async save() {
    const result = await users.findByIdAndUpdate(this.user._id, this.user);

    return result;
  }
}
