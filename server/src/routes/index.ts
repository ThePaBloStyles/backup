import { Router } from "express";
import AuthRoute from "./Auth.route";
import ClientRoute from "./Client.route"
import UsersRoute from './Users.route'
import RolesRoute from './Role.route'
import AdminRoute from './Admin.route'
import ItemRoute from './Item.route' // Assuming Item.route exports a default router
import PaymentRoute from './Payment.route'

const router = Router()

router.use('/api/auth', AuthRoute)
router.use('/api/client', ClientRoute)
router.use('/api/wo', ClientRoute)
router.use('/api/users', UsersRoute)
router.use('/api/roles', RolesRoute)
router.use('/api/items', ItemRoute) // Assuming Item.route exports a default router
router.use('/api/admin', AdminRoute)
router.use('/api/payment', PaymentRoute)

export default router

