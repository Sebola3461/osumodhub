"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var axios = require("axios");
require("colors");
var crypto = require("crypto");
var querystring = require("querystring");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
var mongoose__default = /* @__PURE__ */ _interopDefaultLegacy(mongoose);
var dotenv__default = /* @__PURE__ */ _interopDefaultLegacy(dotenv);
var axios__default = /* @__PURE__ */ _interopDefaultLegacy(axios);
var crypto__default = /* @__PURE__ */ _interopDefaultLegacy(crypto);
var querystring__default = /* @__PURE__ */ _interopDefaultLegacy(querystring);
var Queue = new mongoose.Schema({
  _id: {
    type: String
  },
  banner: {
    type: String,
    default: "/src/static/images/genericbg.jpg"
  },
  name: {
    type: String
  },
  open: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  modes: {
    type: Array,
    default: []
  },
  description: {
    type: String,
    default: "Hi! Welcome to my queue"
  },
  statistics: {
    type: Object,
    default: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Array,
    default: []
  },
  type: {
    type: String,
    default: "modder"
  },
  country: {
    type: Object,
    default: {
      acronym: "--",
      name: "Unknown",
      flag: ""
    }
  },
  allow: {
    type: Object,
    default: {
      graveyard: true,
      wip: true
    }
  },
  genres: {
    type: Array,
    default: ["Everything"]
  },
  followers: {
    type: Array,
    default: []
  },
  autoclose: {
    type: Object,
    default: {
      enable: false,
      size: 5
    }
  },
  timeclose: {
    type: Object,
    default: {
      enable: false,
      size: 5
    }
  },
  twitter: {
    type: String,
    default: ""
  },
  discord: {
    type: String,
    default: ""
  },
  osu: {
    type: String,
    default: ""
  },
  cooldown: {
    type: Object,
    default: {
      enable: false,
      size: 5
    }
  }
});
var User = new mongoose.Schema({
  _id: {
    type: String
  },
  username: {
    type: String
  },
  hasQueue: {
    type: Boolean,
    default: false
  },
  banner: {
    type: String,
    default: "/static/assets/images/genericbg.jpg"
  },
  country: {
    type: Object,
    default: {
      name: "Undefined",
      code: "undefined"
    }
  },
  account_token: {
    type: String,
    default: ""
  },
  access_token: {
    type: String,
    default: ""
  },
  refresh_token: {
    type: String,
    default: ""
  },
  push: {
    type: Object,
    default: {}
  },
  session: {
    type: Object,
    default: {
      online: false,
      currentId: "",
      date: Date
    }
  },
  requests: {
    type: Array,
    default: []
  },
  notifications: {
    type: Array,
    default: []
  }
});
var Request = new mongoose.Schema({
  _id: {
    type: String
  },
  _queue: {
    type: String,
    immutable: true
  },
  _owner: {
    type: String,
    immutable: true
  },
  _owner_name: {
    type: String,
    immutable: true
  },
  comment: {
    type: String,
    default: ""
  },
  reply: {
    type: String,
    default: ""
  },
  beatmapset_id: {
    type: Number
  },
  beatmap: {
    type: Object
  },
  status: {
    type: String,
    default: "pending"
  },
  date: {
    type: Date
  },
  mfm: {
    type: Boolean
  },
  cross: {
    type: Boolean
  }
});
var Follower = new mongoose.Schema({
  _id: {
    type: String
  },
  _queue: {
    type: String,
    immutable: true
  },
  _user: {
    type: String,
    immutable: true
  },
  created_at: {
    type: Date,
    immutable: true
  }
});
dotenv__default["default"].config();
console.log("database", "Starting databse connection...");
mongoose__default["default"].connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {}, (err) => {
  if (err)
    return console.error("database", "An error has occurred:\n".concat(err.message));
  console.log("database", "Database connected!");
});
const users = mongoose__default["default"].model("Users", User);
const queues = mongoose__default["default"].model("Queues", Queue);
const requests = mongoose__default["default"].model("Requests", Request);
const followers = mongoose__default["default"].model("Followers", Follower);
function consoleLog(module_name, message) {
  console.log(`[${module_name}]`.bgYellow.black.concat(message.bgBlue.black));
}
function consoleError(module_name, message) {
  console.log(`[${module_name}]`.bgYellow.black.concat(message.bgRed.black));
}
function consoleCheck(module_name, message) {
  console.log(`[${module_name}]`.bgYellow.black.concat(message.bgGreen.black));
}
async function beatmap(beatmap_id) {
  try {
    consoleLog("beatmap fetcher", `Fetching beatmap ${beatmap_id}`);
    const req = await axios__default["default"]("https://osu.ppy.sh/api/v2/beatmaps/".concat(beatmap_id), {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    const res = req.data;
    consoleCheck("beatmap fetcher", `Beatmap ${beatmap_id} found!`);
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    consoleError("beatmap fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function beatmapset(beatmapset_id, mode) {
  try {
    consoleLog("beatmap fetcher", `Fetching beatmapset ${beatmapset_id}`);
    const req = await axios__default["default"]("https://osu.ppy.sh/api/v2/beatmapsets/".concat(beatmapset_id).concat(mode ? `/${mode}` : ""), {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    const res = req.data;
    consoleCheck("beatmap fetcher", `Beatmapset ${beatmapset_id} found!`);
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    consoleError("beatmap fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function featuredBeatmapsets(page) {
  try {
    consoleLog("beatmap fetcher", `Fetching featured beatmapsets`);
    page = page ? page : 0;
    const req = await axios__default["default"](`https://osu.ppy.sh/api/v2/beatmapsets/search?sort=plays_desc&page=${page}`, {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    const res = req.data;
    consoleCheck("beatmap fetcher", `Featured beatmapsets found!`);
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    consoleError("beatmap fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function beatmapsetDiscussionPost(post_id, type) {
  try {
    consoleLog("beatmap fetcher", `Fetching beatmapset discussion post ${post_id}`);
    const req = await axios__default["default"](`https://osu.ppy.sh/api/v2/beatmapsets/discussions/posts?beatmapset_discussion_id=${post_id}&types[]=${type}&limit=500`, {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    const res = req.data;
    consoleCheck("beatmap fetcher", `Beatmapset discussion post ${post_id} found!`);
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    consoleError("beatmap fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function beatmapsetDiscussionVotes(post_id, type) {
  try {
    consoleLog("beatmap fetcher", `Fetching beatmapset discussion votes ${post_id}`);
    const req = await axios__default["default"](`https://osu.ppy.sh/api/v2/beatmapsets/discussions/votes?beatmapset_discussion_id=${post_id}&types[]=${type}&limit=500`, {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    consoleCheck("beatmap fetcher", `Beatmapset discussion votes ${post_id} found!`);
    return {
      status: 200,
      data: req.data
    };
  } catch (e) {
    consoleError("beatmap fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function userBeatmaps(user_id) {
  try {
    consoleLog("beatmap fetcher", `Fetching user (${user_id}) beatmapsets `);
    let search_types = ["graveyard", "loved", "pending", "ranked"];
    let awaitBeatmaps = new Promise((resolve, reject) => {
      let _r = [];
      let state = 0;
      search_types.forEach(async (status) => {
        let b = await axios__default["default"](`https://osu.ppy.sh/api/v2/users/${user_id}/beatmapsets/${status}?limit=500`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
          }
        });
        let res = b.data;
        for (let i = 0; i < res.length; i++) {
          _r.push(res[i]);
        }
        state++;
        if (state == 4)
          resolveData();
      });
      function resolveData() {
        _r.sort((a, b) => {
          return Number(a.id) - Number(b.id);
        });
        function getSetsData() {
          let _d = {
            plays: 0,
            favourites: 0
          };
          for (let i = 0; i < _r.length; i++) {
            _d.favourites += Number(_r[i].favourite_count);
            _d.plays += Number(_r[i].play_count);
          }
          return _d;
        }
        let sets_data = getSetsData();
        return resolve({
          status: 200,
          data: {
            sets: _r,
            last: _r[_r.length - 1],
            first: _r[0],
            sets_playcount: sets_data.plays,
            sets_favourites: sets_data.favourites
          }
        });
      }
    });
    let data = await awaitBeatmaps;
    return data;
  } catch (e) {
    consoleError("beatmap fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function user(user_id, mode) {
  try {
    let parseMode = function() {
      let link = "https://osu.ppy.sh/api/v2/users/".concat(user_id);
      if (mode) {
        link = `https://osu.ppy.sh/api/v2/users/${user_id}/${mode}`;
      }
      return link;
    };
    consoleLog("user fetcher", `Fetching user ${user_id}`);
    const req = await axios__default["default"](parseMode(), {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    const res = req.data;
    consoleCheck("user fetcher", `user ${user_id} found!`);
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    consoleError("user fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
async function userRecent(user_id, mode) {
  try {
    let parseMode = function() {
      let link = `https://osu.ppy.sh/api/v2/users/${user_id}/scores/recent?include_fails=1`;
      if (mode) {
        link = `https://osu.ppy.sh/api/v2/users/${user_id}/scores/recent?include_fails=1&mode=${mode}`;
      }
      return link;
    };
    consoleLog("user fetcher", `Fetching user ${user_id} recent scores`);
    const req = await axios__default["default"](parseMode(), {
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    const res = req.data;
    consoleCheck("user fetcher", `user ${user_id} recent scores found!`);
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    consoleError("user fetcher", "Wtf an error:");
    console.error(e);
    return {
      status: 500,
      data: e
    };
  }
}
const osu_client_id = process.env.OSU_CLIENT_ID;
const osu_client_secret = process.env.OSU_CLIENT_SECRET;
async function connect() {
  console.log("Refreshing server authorization token");
  let tokens = {};
  try {
    let _t = await axios__default["default"]("https://osu.ppy.sh/oauth/token", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        client_id: osu_client_id,
        client_secret: osu_client_secret,
        grant_type: "client_credentials",
        scope: "public"
      }
    });
    tokens = _t.data;
    setTimeout(connect, Number(tokens.expires_in) * 1e3);
    process.env.OSU_API_ACCESS_TOKEN = tokens.access_token;
    console.log(tokens.access_token);
    console.log("Server authorization token refreshed");
    return tokens;
  } catch (e) {
    console.error("Error during token refresh:\n");
    console.error(e);
    setTimeout(connect, 5e3);
    return tokens;
  }
}
connect();
var osuApi = {
  fetch: {
    beatmap,
    beatmapset,
    featuredBeatmapsets,
    beatmapsetDiscussionPost,
    beatmapsetDiscussionVotes,
    user,
    userBeatmaps,
    userRecent
  }
};
function parseUsergroup(mapper) {
  const userGroupInfo = {
    PPY: {
      index: 0,
      name: "Bald",
      icon: "https://media.discordapp.net/attachments/950107895754784908/953774037790769182/dev.png"
    },
    SPT: {
      index: 1,
      name: "Support Team",
      icon: "https://media.discordapp.net/attachments/950107895754784908/953775607395807242/spt.png"
    },
    DEV: {
      index: 2,
      name: "Developer",
      icon: "https://media.discordapp.net/attachments/950107895754784908/953774037790769182/dev.png"
    },
    GMT: {
      index: 3,
      name: "Global Moderator",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173396361226/gmt.png"
    },
    NAT: {
      index: 4,
      name: "Nomination Assessment Team",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173794832414/nat2.png"
    },
    BN: {
      index: 5,
      name: "Beatmap Nominator",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173199249438/bn2.png",
      probationary: {
        name: "Beatmap Nominator (Probationary)",
        icon: "https://media.discordapp.net/attachments/941102492857557023/948649173983592548/probo.png",
        colour: "#d6c8fc"
      }
    },
    ALM: {
      index: 6,
      name: "Alumni",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649174197489694/alm.png"
    },
    LVD: {
      index: 7,
      name: "Project Loved",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173576740915/lvd.png"
    },
    BOT: {
      index: 8,
      name: "BOT",
      colour: "#ffffff",
      icon: "https://media.discordapp.net/attachments/865037717590245436/955965426964258906/bot.png"
    }
  };
  const usergroups = mapper.groups;
  if (!usergroups)
    return "modder";
  let groups = new Array(usergroups == null ? void 0 : usergroups.length);
  usergroups == null ? void 0 : usergroups.forEach((g) => {
    const index = userGroupInfo[g.short_name].index;
    groups[index] = g;
    groups[index].index = index;
    groups[index].icon = userGroupInfo[g.short_name].icon;
  });
  if (!groups)
    return "mapper";
  if (groups.length > 0) {
    groups.sort((a, b) => {
      return a - b;
    });
    let group = groups[0];
    if (["nat", "bn"].includes(group.short_name.toLowerCase()))
      return group.short_name;
  } else {
    return "mapper";
  }
}
var CreateNewQueue = async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const author = await users.findOne({ account_token: authorization });
  const queue = await queues.findById(author._id);
  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  if (queue != null)
    return res.status(404).send({
      status: 404,
      message: "You already have a queue!"
    });
  if (authorization != author.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  const user2 = await osuApi.fetch.user(author._id);
  if (user2.status != 200 || !user2.data)
    return res.status(400).send({
      status: 400,
      message: "You don't have a osu! account or you're restricted."
    });
  const type = parseUsergroup(user2.data);
  const newQueue = new queues({
    _id: author._id,
    banner: user2.data.cover.url,
    name: user2.data.username,
    icon: `https://a.ppy.sh/${user2.data.id}`,
    type,
    country: {
      acronym: user2.data.country.code,
      name: user2.data.country.name,
      flag: `https://flagcdn.com/${user2.data.country.code}.svg`
    }
  });
  await newQueue.save();
  const newQueueResponse = await queues.findById(author._id);
  await users.updateOne({ _id: author.id }, {
    hasQueue: true
  });
  res.status(200).send({
    status: 200,
    message: "Queue created. Welcome to osu!modhub",
    data: newQueueResponse
  });
};
var checkQueueAutoclose = async (queue) => {
  if (!queue.autoclose.enable)
    return void 0;
  const queue_requests = await requests.find({
    _queue: queue._id,
    status: "pending"
  });
  if (queue_requests.length >= queue.autoclose.size)
    await queues.updateOne({ _id: queue._id }, {
      open: false
    });
  return void 0;
};
var checkRequestQueueModes = (queue, beatmapset2) => {
  if (!beatmapset2.beatmaps)
    return false;
  let pass = false;
  beatmapset2.beatmaps.forEach((b) => {
    if (queue.modes.includes(b.mode_int))
      pass = true;
  });
  return pass;
};
var CreateRequest = async (req, res) => {
  const authorization = req.headers.authorization;
  const requestedQueue = req.params["queue"];
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const author = await users.findOne({ account_token: authorization });
  const queue = await queues.findById(requestedQueue);
  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  if (authorization != author.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  if (!queue.open)
    return res.status(403).send({
      status: 403,
      message: "This queue is closed!"
    });
  let { comment, beatmapset_id } = req.body;
  const requestedBeatmapset = await osuApi.fetch.beatmapset(beatmapset_id);
  if (requestedBeatmapset.status != 200 || !requestedBeatmapset.data)
    return res.status(requestedBeatmapset.status).send({
      status: requestedBeatmapset.status,
      message: "Invalid beatmap"
    });
  if (!comment)
    comment = "";
  comment = comment.trim();
  if (!queue.allow.graveyard && requestedBeatmapset.data.status == "graveyard" || !queue.allow.wip && requestedBeatmapset.data.status == "wip")
    return res.status(400).send({
      status: 400,
      message: `This queue does not allow ${requestedBeatmapset.data.status} beatmaps!`
    });
  if (!checkRequestQueueModes(queue, requestedBeatmapset.data))
    return res.status(400).send({
      status: 400,
      message: `This queue does not allow beatmaps of this mode!`
    });
  const pending_request = await requests.findOne({
    _owner: author._id,
    beatmapset_id: requestedBeatmapset.data.id,
    status: "pending"
  });
  if (pending_request != null)
    return res.status(403).send({
      status: 403,
      message: `You already requested this beatmap here!`
    });
  const request_id = crypto__default["default"].randomBytes(30).toString("hex");
  const request = new requests({
    _id: request_id,
    _queue: queue._id,
    _owner: author._id,
    _owner_name: author.username,
    comment,
    status: "pending",
    beatmapset_id: requestedBeatmapset.data.id,
    date: new Date(),
    beatmap: {
      id: requestedBeatmapset.data.id,
      artist: requestedBeatmapset.data.artist,
      title: requestedBeatmapset.data.title,
      covers: requestedBeatmapset.data.covers
    }
  });
  await request.save();
  queue.statistics[0] = queue.statistics[0] + 1;
  await queues.findByIdAndUpdate(queue._id, queue);
  await checkQueueAutoclose(queue);
  res.status(200).send({
    status: 200,
    message: "Beatmap requested!",
    data: request
  });
};
var DeleteRequest = async (req, res) => {
  const authorization = req.headers.authorization;
  const _request = req.params["request"];
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const queue_owner = await users.findOne({ account_token: authorization });
  if (queue_owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  const queue = await queues.findById(queue_owner._id);
  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  if (authorization != queue_owner.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  const request = await requests.findById(_request);
  if (request == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!"
    });
  await requests.deleteOne({ _id: _request });
  res.status(200).send({
    status: 200,
    message: "Request deleted!"
  });
};
var FollowQueue = async (req, res) => {
  const id = req.params["queue"];
  const authorization = req.headers.authorization;
  const queue = await queues.findById(id);
  if (!authorization)
    return res.status(404).send({
      status: 404,
      message: "Missing authorization"
    });
  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  const user2 = await users.findOne({ account_token: authorization });
  if (!user2)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  const follower = await followers.findOne({ _user: user2._id, _queue: id });
  if (follower)
    return res.status(404).send({
      status: 403,
      message: "You already follow this user!"
    });
  const newFollower = new followers({
    _id: crypto__default["default"].randomBytes(30).toString("hex"),
    _user: user2._id,
    _queue: queue._id,
    created_at: new Date()
  });
  await newFollower.save();
  return res.status(200).send({
    status: 200,
    message: `You're following ${queue.name} now!`
  });
};
var GetFollowers = async (req, res) => {
  const id = req.params["queue"];
  const queue = await queues.findById(id);
  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  const _followers = await followers.find({ _queue: queue._id });
  return res.status(200).send({
    status: 200,
    data: _followers
  });
};
var GetQueue = async (req, res) => {
  const id = req.params["id"];
  const queue = await queues.findById(id);
  return res.status(200).send({
    status: 200,
    data: queue
  });
};
var GetQueueRequests = async (req, res) => {
  const queue = req.params["queue"];
  let r = await requests.find({ _queue: queue });
  const type = req.query.type || "progress";
  const status = req.query.status || "any";
  if (type == "archived") {
    r = r.filter((r2) => r2.status == "archived");
  } else {
    r = r.filter((r2) => r2.status != "archived");
  }
  const validQueueStatus = [
    "pending",
    "archived",
    "accepted",
    "rejected",
    "waiting",
    "rechecking",
    "nominated",
    "finished"
  ];
  if (validQueueStatus.includes(String(status))) {
    r = r.filter((r2) => r2.status == status);
  }
  let requestsWithoutBeatmap = r;
  r = [];
  for (const req2 of requestsWithoutBeatmap) {
    try {
      const b = await osuApi.fetch.beatmapset(req2.beatmapset_id);
      if (b.status == 200) {
        req2.beatmap = b.data;
      }
      r.push(req2);
    } catch (e) {
      consoleError("GetQueueRequests", e);
    }
  }
  return res.status(200).send({
    status: 200,
    data: r
  });
};
var ListQueues = async (req, res) => {
  let search = req.query.q;
  let status = req.query.open;
  let type = req.query.type;
  let mode = req.query.mode;
  let _sort = req.query.sort;
  const allQueues = await queues.find();
  let response = [];
  allQueues.forEach((q) => {
    response.push({
      _id: q._id,
      name: q.name,
      banner: q.banner,
      type: q.type,
      modes: q.modes,
      genres: q.genres,
      open: q.open,
      country: q.country,
      icon: q.icon,
      verified: q.verified
    });
  });
  if (search) {
    search = search.toString().toLowerCase().trim();
    search.split(" ").forEach((arg) => {
      response = response.filter((r) => r.name.toLowerCase().includes(arg.toLowerCase()) || r.genres.includes(arg.toLowerCase()));
    });
  }
  if (mode) {
    let _mode = Number(mode.toString().toLowerCase().trim());
    if (!isNaN(_mode)) {
      response = response.filter((r) => r.modes.includes(_mode));
    }
  }
  if (status != void 0) {
    let _status = status.toString().toLowerCase().trim();
    if (status.toString().toLowerCase().trim() == "false") {
      _status = false;
    } else if (status.toString().toLowerCase().trim() == "true") {
      _status = true;
    }
    if (status.toString().toLowerCase().trim() != "any") {
      response = response.filter((r) => r.open == _status);
    }
  }
  if (type) {
    let _type = type.toString().toLowerCase().trim();
    if (_type != "any") {
      response = response.filter((r) => r.type == _type);
    }
  }
  if (_sort) {
    _sort = _sort.toString().toLowerCase().trim();
    switch (_sort) {
      case "ab": {
        response.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
        });
        break;
      }
      case "ba": {
        response.sort((a, b) => {
          if (b.name.toLowerCase() < a.name.toLowerCase()) {
            return -1;
          }
          if (b.name.toLowerCase() > a.name.toLowerCase()) {
            return 1;
          }
        });
        break;
      }
      default: {
        response.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
        });
        break;
      }
    }
  } else {
    response.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
    });
  }
  return res.status(200).send({
    status: 200,
    data: response
  });
};
var RemoveFollower = async (req, res) => {
  const id = req.params["queue"];
  const authorization = req.headers.authorization;
  const queue = await queues.findById(id);
  if (!authorization)
    return res.status(404).send({
      status: 404,
      message: "Missing authorization"
    });
  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  const user2 = await users.findOne({ account_token: authorization });
  if (!user2)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  const follower = await followers.findOne({ _user: user2._id });
  if (!follower)
    return res.status(404).send({
      status: 403,
      message: "You are not following this user!"
    });
  await followers.deleteOne({ _id: follower._id });
  return res.status(200).send({
    status: 200,
    message: `You're not following ${queue.name} anymore!`
  });
};
var SyncQueue = async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const author = await users.findOne({ account_token: authorization });
  const queue = await queues.findById(author._id);
  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "You don't have a queue!"
    });
  if (authorization != author.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  const user2 = await osuApi.fetch.user(author._id);
  if (user2.status != 200 || !user2.data)
    return res.status(400).send({
      status: 400,
      message: "You don't have a osu! account or you're restricted."
    });
  const type = parseUsergroup(user2.data);
  queue.banner = user2.data.cover.url;
  queue.name = user2.data.username;
  queue.type = type;
  await users.updateOne({ _id: author.id }, {
    name: user2.data.username,
    cover: user2.data.cover.url,
    type
  });
  res.status(200).send({
    status: 200,
    message: "Queue data updated!"
  });
};
var UpdateQueue = async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const queue_owner = await users.findOne({ account_token: authorization });
  if (queue_owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  const queue = await queues.findById(queue_owner._id);
  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  if (authorization != queue_owner.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  const editable = ["description", "open", "modes", "allow"];
  const _queue = Object.keys(req.body);
  for (const opt of _queue) {
    if (editable.includes(opt)) {
      if (req.body.open != null && req.body.open != void 0 && typeof req.body.open == "boolean") {
        queue.open = Boolean(req.body.open);
      }
      if (req.body.description && typeof req.body.description == "string") {
        queue.description = req.body.description;
      }
      if (req.body.genres && typeof req.body.genres == "object" && req.body.genres.length) {
        const clearGenres = [];
        req.body.genres.splice(35, 9999);
        req.body.genres.forEach((genre) => {
          if (typeof genre == "string")
            clearGenres.push(genre);
        });
        queue.genres = clearGenres;
      }
      if (req.body.autoclose && typeof req.body.autoclose == "object") {
        if (typeof req.body.autoclose.enable == "boolean") {
          queue.autoclose.enable = req.body.autoclose.enable;
        }
        if (typeof req.body.autoclose.size == "number") {
          queue.autoclose.size = req.body.autoclose.size;
        }
      }
      if (req.body.allow && typeof req.body.allow == "object") {
        queue.allow = {
          wip: req.body.allow.wip ? typeof Boolean(req.body.allow.wip) == "boolean" ? Boolean(req.body.allow.wip) : queue.allow.wip : queue.allow.wip,
          graveyard: req.body.allow.graveyard ? typeof req.body.allow.graveyard == "boolean" ? req.body.allow.graveyard : queue.allow.graveyard : queue.allow.graveyard
        };
      }
      if (req.body.modes && typeof req.body.modes == "object") {
        if (req.body.modes.length < 5 && req.body.modes != 0) {
          const clearModes = [];
          req.body.modes.forEach((m) => {
            if (!clearModes.includes(m) && !isNaN(Number(m)) && Number(m) > -1 && Number(m) < 5) {
              clearModes.push(m);
            }
          });
          queue.modes = clearModes;
        }
      }
    }
  }
  await queues.updateOne({ _id: queue._id }, queue);
  res.status(200).send({
    status: 200,
    message: "Queue updated!"
  });
};
var UpdateRequest = async (req, res) => {
  const authorization = req.headers.authorization;
  const _request = req.params["request"];
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const queue_owner = await users.findOne({ account_token: authorization });
  if (queue_owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  const queue = await queues.findById(queue_owner._id);
  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!"
    });
  if (authorization != queue_owner.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  const request = await requests.findById(_request);
  if (request == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!"
    });
  let { reply, status } = req.body;
  if (!status)
    return res.status(400).send({
      status: 400,
      message: "Invalid status provided"
    });
  if (!reply)
    reply = "";
  reply = reply.trim();
  const valid_status = [
    { name: "accepted", bn: false },
    { name: "rejected", bn: false },
    { name: "finished", bn: false },
    { name: "archived", bn: false },
    { name: "waiting", bn: true },
    { name: "rechecking", bn: true },
    { name: "nominated", bn: true }
  ];
  const requestedStatus = valid_status.find((s) => s.name == status.toLowerCase());
  if (!requestedStatus)
    return res.status(400).send({
      status: 400,
      message: "Invalid status provided"
    });
  if (requestedStatus.bn && !queue_owner.isBn)
    return res.status(400).send({
      status: 400,
      message: "You can't use this status!"
    });
  await requests.updateOne({ _id: _request }, {
    reply,
    status: status.toLowerCase()
  });
  res.status(200).send({
    status: 200,
    message: "Request updated!"
  });
};
var createNewUser = async (user2) => {
  try {
    const accountToken = crypto__default["default"].randomBytes(30).toString("hex");
    const newUser = new users({
      _id: user2.id,
      username: user2.username,
      account_token: accountToken,
      country: {
        name: user2.country.code,
        code: user2.country.name
      }
    });
    await newUser.save();
    const u = users.findById(user2.id);
    return {
      status: 200,
      data: u
    };
  } catch (e) {
    console.error(e);
    return { status: 500, message: e.message };
  }
};
var getOsuTokenOwner = async (token) => {
  try {
    const req = await axios__default["default"]("https://osu.ppy.sh/api/v2/me", {
      method: "get",
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    let res = req.data;
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: e.message
    };
  }
};
var validateOsuToken = async (token) => {
  try {
    const req = await axios__default["default"]("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      data: querystring__default["default"].stringify({
        client_id: process.env.OSU_CLIENT_ID,
        client_secret: process.env.OSU_CLIENT_SECRET,
        code: token,
        grant_type: "authorization_code",
        redirect_uri: encodeURI(process.env.OSU_REDIRECT_URI)
      })
    });
    return {
      status: 200,
      data: req.data
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: e.message
    };
  }
};
var AuthenticateUser = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code)
      return res.status(400).send({
        status: 400,
        message: "Invalid code provided"
      });
    const osuTokens = await validateOsuToken(code.toString());
    if (osuTokens.status != 200)
      return res.status(osuTokens.status).send({
        status: osuTokens.status,
        message: osuTokens.message
      });
    const tokenOwner = await getOsuTokenOwner(osuTokens.data.access_token);
    if (tokenOwner.status != 200)
      return res.status(tokenOwner.status).send({
        status: tokenOwner.status,
        message: tokenOwner.message
      });
    let user_db = await users.findById(tokenOwner.data.id);
    if (user_db == null) {
      const newUser = await createNewUser(tokenOwner.data);
      if (newUser.status != 200)
        res.status(tokenOwner.status).send({
          status: tokenOwner.status,
          message: tokenOwner.message
        });
      user_db = newUser.data;
    }
    return res.status(200).send(`<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Please wait...</title>
        </head>
        <body><script>window.postMessage(JSON.stringify({ _id: ${user_db._id}, username: "${user_db.username}", hasQueue: ${user_db.hasQueue}, account_token: "${user_db.account_token}" }));<\/script></body>
      </html>`);
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 500,
      message: "Internal server error"
    });
  }
};
var getUserBeatmaps = async (user_id, status) => {
  try {
    const req = await axios__default["default"](`https://osu.ppy.sh/api/v2/users/${user_id}/beatmapsets/${status || "pending"}`, {
      method: "get",
      headers: {
        authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`
      }
    });
    let res = req.data;
    return {
      status: 200,
      data: res
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: e.message
    };
  }
};
var GetUserBeatmaps = async (req, res) => {
  const authorization = req.headers.authorization;
  const requestedUser = req.params["user"];
  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization"
    });
  const user2 = await users.findById(requestedUser);
  if (user2 == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!"
    });
  if (authorization != user2.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized"
    });
  const userBeatmaps2 = await getUserBeatmaps(user2._id);
  if (userBeatmaps2.status != 200 || !userBeatmaps2.data)
    return res.status(userBeatmaps2.status).send({
      status: userBeatmaps2.status,
      message: userBeatmaps2.message
    });
  return res.status(200).send({
    status: 200,
    message: "Found!",
    data: userBeatmaps2.data
  });
};
const api = express.Router();
api.put("/requests/:request", UpdateRequest);
api.get("/queues/:queue/follow", GetFollowers);
api.get("/queues/listing", ListQueues);
api.get("/queues/:id", GetQueue);
api.get("/queues/:queue/requests", GetQueueRequests);
api.get("/users/:user/beatmaps", GetUserBeatmaps);
api.get("/validate/", AuthenticateUser);
api.post("/queues/new", CreateNewQueue);
api.post("/queues/sync", SyncQueue);
api.post("/queues/:queue/requests", CreateRequest);
api.post("/queues/:queue/follow", FollowQueue);
api.post("/queues/update", UpdateQueue);
api.delete("/queues/:queue/follow", RemoveFollower);
api.delete("/requests/:request", DeleteRequest);
const ApiRoutes = api;
var DiscordEmbed = async (req, res, next) => {
  if (req.headers["user-agent"] != "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)")
    return next();
  if (req.path.includes("queue"))
    return sendQueueEmbed();
  async function sendQueueEmbed() {
    const queue_id = req.path.split("/").pop();
    const queue = await queues.findById(queue_id);
    if (queue == null)
      return res.status(404).send(`<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="osu!modhub | Queue not found!">
      <meta property="og:site_name" content="osu!modhub">
      <meta property="og:url" content="https://osumodhub.com/">
      <meta property="og:description" content="osu!modhub provides mapping & modding tools for osu!">
      <meta property="og:type" content="profile">
      <title>osu!modhub | Queue not found!</title>
    </head>
  </html>`);
    res.status(200).send(`<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="osu!modhub | Sebola's queue">
          <meta property="og:site_name" content="osu!modhub">
          <meta property="og:url" content="https://osumodhub.com/queue/${queue._id}">
          <meta property="og:description" content="osu!modhub provides mapping & modding tools for osu!">
          <meta property="og:type" content="profile">
          <title>osu!modhub | ${queue.name}'s queue</title>
        </head>
      </html>`);
  }
};
(function dedupeRequire(dedupe) {
  const Module = require("module");
  const resolveFilename = Module._resolveFilename;
  Module._resolveFilename = function(request, parent, isMain, options) {
    if (request[0] !== "." && request[0] !== "/") {
      const parts = request.split("/");
      const pkgName = parts[0][0] === "@" ? parts[0] + "/" + parts[1] : parts[0];
      if (dedupe.includes(pkgName)) {
        parent = module;
      }
    }
    return resolveFilename(request, parent, isMain, options);
  };
})(["react", "react-dom"]);
const app = express__default["default"]();
app.use(express.json());
app.get("*", DiscordEmbed);
app.get("/", (req, res) => {
  res.status(200).sendFile(path__default["default"].resolve(__dirname.concat("./../index.html")));
});
app.use("/api/", ApiRoutes);
const handler = app;
exports["default"] = app;
exports.handler = handler;
