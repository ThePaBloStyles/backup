import { saveRole, getAllRoles } from '../controllers/Role.controller'
import {Router} from 'express'

const router = Router()

router.post('/saveRole', saveRole)
router.get('/getAllRoles', getAllRoles)

export default router