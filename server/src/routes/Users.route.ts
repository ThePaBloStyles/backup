import { getAllUsers, newUser, deleteUser, updateUser, getUser, updateUserProfile, changeUserPassword, getUserOrders } from '../controllers/Users.controller'
import {Router} from 'express'

const router = Router()

router.get('/getAllUsers', getAllUsers)
router.get('/getUser/:id', getUser)
router.get('/getUserOrders/:id', getUserOrders)
router.post('/newUser', newUser)
router.delete('/deleteUser/:id', deleteUser)
router.put('/updateUser/:id', updateUser)
router.put('/updateProfile/:id', updateUserProfile)
router.put('/changePassword/:id', changeUserPassword)

export default router