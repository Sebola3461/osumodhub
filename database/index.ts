import mongoose from "mongoose";
import Queue from "./schemas/Queue";
import User from "./schemas/User";
import Request from "./schemas/Request";
import dotenv from "dotenv";
import Follower from "./schemas/Follower";
import Notification from "./schemas/Notification";
import GDRequests from "./schemas/GDRequests";
import GDUsers from "./schemas/GDUsers";
import { beatmapset } from "../server/helpers/fetcher/beatmap";
dotenv.config();

console.log("database", "Starting databse connection...");

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  {},
  (err) => {
    if (err)
      return console.error(
        "database",
        "An error has occurred:\n".concat(err.message)
      );

    console.log("database", "Database connected!");
  }
);

export const users = mongoose.model("Users", User);
export const queues = mongoose.model("Queues", Queue);
export const requests = mongoose.model("Requests", Request);
export const gds = mongoose.model("GDRequests", GDRequests);
export const gdusers = mongoose.model("GDUsers", GDUsers);
export const followers = mongoose.model("Followers", Follower);
export const notifications = mongoose.model("Notifications", Notification);

// queues.find().then((doc) => {
//   doc.forEach(async (q, i) => {
//     const queueRequests = await requests.find({ _queue: q._id });

//     if (queueRequests.length > 0) {
//       queueRequests.sort(
//         (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
//       );

//       const last = queueRequests[0];

//       q.lastSeen = last.date;

//       await queues.findByIdAndUpdate(q._id, q);

//       console.log(`== ${i + 1}/${doc.length}`);
//     }
//   });
// });
