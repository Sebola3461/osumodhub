import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
  },
  _user: {
    type: String,
    immutable: true,
  },
  _user_name: {
    type: String,
    immutable: true,
  },
  content: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "queue",
  },
  created_at: {
    type: Date,
  },
  extra: {
    type: Object,
    default: {},
  },
});
