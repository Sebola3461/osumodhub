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
  queues: {
    type: Array,
    default: [],
  },
  rawQueues: {
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
  modes: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
  },
  cross: {
    type: Boolean,
  },
  isGd: {
    type: Boolean,
    default: true,
  },
});
