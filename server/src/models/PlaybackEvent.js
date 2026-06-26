import mongoose from 'mongoose';

const PlaybackEventSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  updateData: {
    type: Buffer,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

PlaybackEventSchema.index({ roomId: 1, timestamp: 1 });

export default mongoose.model('PlaybackEvent', PlaybackEventSchema);
