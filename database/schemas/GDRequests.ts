import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
  },
  _queue: {
    type: String,
    immutable: true,
  },
  _owner: {
    type: String,
    immutable: true,
  },
  _owner_name: {
    type: String,
    immutable: true,
  },
  comment: {
    type: String,
    default: "",
  },
  reply: {
    type: String,
    default: "",
  },
  beatmapset_id: {
    type: Number,
  },
  beatmap: {
    type: Object,
  },
  status: {
    type: String,
    default: "pending",
  },
  type: {
    type: String,
    default: "modding",
  },
  difficulties: {
    type: Array,
    default: [{ min_sr: 0, max_sr: 20, name: "Extra", mode: 0, user: null }],
  },
  genres: {
    type: Array,
    default: [],
  },
  modes: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
  },
  mfm: {
    type: Boolean,
  },
  cross: {
    type: Boolean,
  },
});
