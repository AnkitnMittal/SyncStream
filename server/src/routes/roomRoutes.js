import { Router } from 'express';
import { createRoom, getPlaybackSession } from '../controllers/roomController.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.post('/', catchAsync(createRoom));
router.get('/:roomId/playback', catchAsync(getPlaybackSession));

export default router;
