import { roomService } from '../services/roomService.js';
import { docService } from '../services/docService.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const createRoom = async (req, res, next) => {
  const { password } = req.body;
  const room = await roomService.provisionRoom(password);

  return res.status(201).json({ roomId: room._id });
};

export const getPlaybackSession = async (req, res, next) => {
  const { roomId } = req.params;

  const room = await roomService.findRoomById(roomId);

  if (!room) {
    return next(new AppError('The target room does not exist.', 404));
  }

  const events = await docService.getPlaybackStream(roomId);

  return res.status(200).json({
    success: true,
    language: room.language || 'javascript',
    count: events.length,
    events,
  });
};
