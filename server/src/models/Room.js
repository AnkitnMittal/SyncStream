import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  documentState: {
    type: Buffer,
    default: null,
  },
  language: {
    type: String,
    default: 'javascript',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RoomSchema.index({ _id: 1, password: 1 });

export default mongoose.model('Room', RoomSchema);
