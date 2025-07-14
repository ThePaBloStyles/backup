import { getAllUsers, newUser, deleteUser, updateUser, getUser } from '../controllers/Users.controller'
import {Router} from 'express'

const router = Router()

router.get('/getAllUsers', getAllUsers)
router.get('/getUser/:id', getUser)
router.post('/newUser', newUser)
router.delete('/deleteUser/:id', deleteUser)
router.put('/updateUser/:id', updateUser)

export default router