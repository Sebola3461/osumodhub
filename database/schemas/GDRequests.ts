import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
  },
  owner: {
    type: String,
    immutable: true,
  },
  owner_name: {
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
  queues: {
    type: Array,
    default: [],
  },
  responses: {
    type: Array,
    default: [],
  },
  difficulties: {
    type: Array,
    default: [],
  },
  genres: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
  },
  isGd: {
    type: Boolean,
    default: true,
  },
});
