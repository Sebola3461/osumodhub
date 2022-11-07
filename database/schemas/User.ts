import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
  },
  username: {
    type: String,
  },
  hasQueue: {
    type: Boolean,
    default: false,
  },
  isBn: {
    type: Boolean,
    default: false,
  },
  banner: {
    type: String,
    default: "/static/assets/images/genericbg.jpg",
  },
  color: {
    type: String,
    default: "#21bc8e",
  },
  language: {
    type: String,
    default: "enUS",
  },
  country: {
    type: Object,
    default: {
      name: "Undefined",
      code: "undefined",
    },
  },
  account_token: {
    type: String,
    default: "",
  },
  access_token: {
    type: String,
    default: "",
  },
  refresh_token: {
    type: String,
    default: "",
  },
  push: {
    type: Object,
    default: {},
  },
  pushSettings: {
    type: Object,
    default: {
      enable: false,
    },
  },
  session: {
    type: Object,
    default: {
      online: false,
      currentId: "",
      date: Date,
    },
  },
  requests: {
    type: Array,
    default: [],
  },
});
