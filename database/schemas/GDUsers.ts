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
    default: "waiting",
  },
  difficulty: {
    type: String,
  },
  difficulty_data: {
    type: Object,
  },
  request_id: {
    type: String,
  },
  date: {
    type: Date,
  },
});
