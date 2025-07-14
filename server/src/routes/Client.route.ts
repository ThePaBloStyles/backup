import { createClient, editClient, getClients } from '../controllers/Client.controller'
import {Router} from 'express'

const router = Router()

router.get('/getClients', getClients)
router.post('/createClient', createClient)
router.post('/editClient', editClient)

export default router