import { Router } from 'express'
import { validateId, validatePerson } from '../utils/validate'
import {
  getPerson,
  getPersons,
  createPerson,
  deletePerson,
  updatePerson
} from '../controllers/person'

const router = Router()

router.post('/', validatePerson, createPerson)

router.get('/:id', validateId, getPerson)

router.get('/', getPersons)

router.put('/:id', validateId, validatePerson, updatePerson)

router.delete('/:id', validateId, deletePerson)

export default router
