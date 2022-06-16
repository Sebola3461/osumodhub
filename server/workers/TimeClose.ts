import { queues } from "../../database";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default () => {
  setInterval(async () => {
    consoleLog("TimeClose", "Checking queues...");

    const allOpenQueues = await queues.find({ open: false });

    consoleLog("TimeClose", `${allOpenQueues.length} queues found!`);

    for (const queue of allOpenQueues) {
      if (queue.timeclose.enable) {
        consoleLog(
          "TimeClose",
          `Updating status for ${queue.name} (${queue._id})`
        );

        const closeDate = new Date(queue.timeclose.scheduled);
        closeDate.setUTCDate(closeDate.getUTCDate() + queue.timeclose.close);

        if (
          new Date(closeDate.toUTCString()).valueOf() >=
          new Date(new Date(queue.timeclose.scheduled).toUTCString()).valueOf()
        ) {
          queue.open = false;
          queues.findByIdAndUpdate(queue._id, queue);

          consoleCheck(
            "TimeClose",
            `Queue ${queue.name} (${queue._id}) closed by time`
          );
        } else {
          consoleLog(
            "TimeClose",
            `Nothing changed for ${queue.name} (${queue._id})`
          );
        }
      }
    }
  }, 60000);
};
