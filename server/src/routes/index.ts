import { Router } from "express";
import AuthRoute from "./Auth.route";
// import ClientRoute from "./Client.route"
import UsersRoute from './Users.route'
import RoleRoute from './Role.route'
// import AdminRoute from './Admin.route'
import ItemRoute from './Item.route' // Assuming Item.route exports a default router
// import PaymentRoute from './Payment.route' // Temporarily disabled to debug

const router = Router()

router.use('/api/auth', AuthRoute)
// router.use('/api/client', ClientRoute) 
// router.use('/api/wo', ClientRoute)
router.use('/api/users', UsersRoute)
router.use('/api/roles', RoleRoute)
router.use('/api/items', ItemRoute) // Assuming Item.route exports a default router
// router.use('/api/admin', AdminRoute)
// router.use('/api/payment', PaymentRoute) // Temporarily disabled to debug - force restart 2

export default router

