import { Router } from "express";
import AuthRoute from "./Auth.route";
import UsersRoute from './Users.route';
import ItemRoute from './Item.route';

const router = Router();

router.use('/api/auth', AuthRoute);
router.use('/api/users', UsersRoute);
router.use('/api/items', ItemRoute);

export default router;

