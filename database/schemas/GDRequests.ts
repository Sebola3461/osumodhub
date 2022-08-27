import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
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
  difficulties: {
    type: Array,
    default: [],
  },
  genres: {
    type: Array,
    default: [],
  },
  tags: {
    type: Array,
    default: [],
  },
  modes: {
    type: Array,
    default: [],
  },
  queue: {
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
  pending: {
    type: Boolean,
  },
});
