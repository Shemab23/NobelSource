import { Router } from 'express';

import authRoutes from './auth';
import userRoutes from './user';
import auditRoutes from './audit';
import logisticRoutes from './logistic';
import postRoutes from './post';
import roomRoutes from './room';
import roomMemberRoutes from './room_member';
import entityRoutes from './entity';
import messageRoutes from './message';
import itemRoutes from './items';
import disputeRoutes from './dispute';

import { authGuard } from '../middlewares/auth';
import { adminGuard } from '../middlewares/admin';

const router = Router();

router.get('/', (req, res) => {
    return res.json({
        status: 'ok',
        message: 'Welcome to the Nobelsource API',
    });
})


// semi - public
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/rooms', roomRoutes);

// protected
router.use(authGuard);

router.use('/users', userRoutes);
router.use('/audit', auditRoutes);
router.use('/logistics', logisticRoutes);

router.use('/entities', entityRoutes);
router.use('/messages', messageRoutes);

router.use('/room_member/', roomMemberRoutes);
router.use('/items', itemRoutes);

router.use('/disputes', disputeRoutes);

export default router;
