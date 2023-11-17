import { Router } from 'express'
import {getLogs} from '../controllers/logs'

const router = Router()

router.get('/', getLogs)

export default router
