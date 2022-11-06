import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
  },
  owner: {
    type: String,
  },
  isGroup: {
    type: Boolean,
  },
  banner: {
    type: String,
    default: "/src/static/images/genericbg.jpg",
  },
  name: {
    type: String,
  },
  open: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
  },
  modes: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
    default: "Hi! Welcome to my queue",
  },
  admins: {
    type: Array,
    default: [],
  },

  /**
   * pending
   * accepted
   * rejected
   * waiting another bn
   * recheck
   * finished
   * nominated
   * archived
   */
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
      7: 0,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: "modder",
  },
  country: {
    type: Object,
    default: {
      acronym: "--",
      name: "Unknown",
      flag: "",
      flag_url: "",
    },
  },
  allow: {
    type: Object,
    default: {
      graveyard: true,
      wip: true,
      cross: true,
      gd: false,
    },
  },
  genres: {
    type: Array,
    default: ["Everything"],
  },
  followers: {
    type: Array,
    default: [],
  },
  autoclose: {
    type: Object,
    default: {
      enable: false,
      size: 5,
    },
  },
  timeclose: {
    type: Object,
    default: {
      enable: false,
      scheduled: "",
      size: 1,
    },
  },
  twitter: {
    type: String,
    default: "",
  },
  discord: {
    type: String,
    default: "",
  },
  osu: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#21bc8e",
  },
  lastSeen: {
    type: Date,
    default: null,
  },
  webhook: {
    type: Object,
    default: {
      url: "",
      notify: ["request:update", "request:new", "queue:state"],
    },
  },
  cooldown: {
    type: Object,
    default: {
      enable: false,
      size: 5,
    },
  },
});
