import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
  },
  _queue: {
    type: String,
    immutable: true,
  },
  _user: {
    type: String,
    immutable: true,
  },
  created_at: {
    type: Date,
    immutable: true,
  },
});
