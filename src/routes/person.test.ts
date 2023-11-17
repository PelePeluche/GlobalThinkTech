import request from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import { faker } from '@faker-js/faker'
import personRouter from '../routes/person'
import { initDb } from '../database/db-init'
import { isPerson } from '../utils/validate'

const app = express()

app.use(bodyParser.json())
app.use('/api/person', personRouter)

describe('CRUD /api/person', () => {
  beforeEach(async () => {
    await initDb
  })

  it('should return a list of persons', async () => {
    const res = await request(app).get('/api/person')

    expect(res.statusCode).toEqual(200) // Check the status code
    expect(Array.isArray(res.body)).toBe(true) // Check if the response is an array
    res.body.forEach((object: any) => {
      // Check if each object is of type Person
      expect(isPerson(object)).toBe(true)
    })
  })

  it('should return a paginated list of persons', async () => {
    const page = faker.number.int({ min: 1, max: 5 })
    const pageSize = faker.number.int({ min: 1, max: 10 })

    const res = await request(app).get(
      `/api/person?page=${page}&pageSize=${pageSize}`
    )

    expect(res.statusCode).toEqual(200) // Check the status code
    expect(res.body.length).toBe(pageSize) // Check the sizePage
  })

  it('should return a person or an error', async () => {
    const resAll = await request(app).get('/api/person')
    const personsLength = resAll.body.length

    const idOutOfRange = faker.number.int({ min: personsLength + 1 })
    const idInRange = faker.number.int({ min: 1, max: personsLength })

    const resOutOfRange = await request(app).get(`/api/person/${idOutOfRange}`)
    const resInRange = await request(app).get(`/api/person/${idInRange}`)

    expect(resOutOfRange.statusCode).toEqual(404) // Check the status code for not found

    expect(resInRange.statusCode).toEqual(200) // Check the status code
    expect(isPerson(resInRange.body)).toBe(true) // Check if the response is of type Person
  })

  it('should create a new person', async () => {
    const newPerson = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toISOString(),
      bio: faker.person.bio(),
      lucky_number: faker.number.int({ min: 1 })
    }

    const res = await request(app).post('/api/person').send(newPerson)

    expect(res.statusCode).toEqual(201) // Check the status code
  })

  it('should not create a new person without required fields', async () => {
    const newPerson = {
      first_name: faker.person.firstName(),
      // last_name is missing
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toISOString(),
      bio: faker.person.bio(),
      lucky_number: faker.number.int({ min: 1 })
    }

    const res = await request(app).post('/api/person').send(newPerson)

    expect(res.statusCode).toEqual(400) // Check the status code
  })

  it('should update a person within range', async () => {
    const resAll = await request(app).get('/api/person')
    const personsLength = resAll.body.length

    const id = faker.number.int({ min: 1, max: personsLength })

    const updatedPerson = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toISOString(),
      bio: faker.person.bio(),
      lucky_number: faker.number.int({ min: 1 })
    }

    const res = await request(app).put(`/api/person/${id}`).send(updatedPerson)
    expect(res.statusCode).toEqual(200) // Check the status code
  })

  it('should not update a person out of range', async () => {
    const resAll = await request(app).get('/api/person')
    const personsLength = resAll.body.length

    const id = faker.number.int({ min: personsLength + 1 })

    const updatedPerson = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toISOString(),
      bio: faker.person.bio(),
      lucky_number: faker.number.int({ min: 1 })
    }

    const res = await request(app).put(`/api/person/${id}`).send(updatedPerson)
    expect(res.statusCode).toEqual(404) // Check the status code
  })

  it('should not update a person without required fields', async () => {
    const resAll = await request(app).get('/api/person')
    const personsLength = resAll.body.length

    const id = faker.number.int({ min: 1, max: personsLength })

    const updatedPerson = {
      // first_name is missing
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toISOString(),
      bio: faker.person.bio(),
      lucky_number: faker.number.int({ min: 1 })
    }

    const res = await request(app).put(`/api/person/${id}`).send(updatedPerson)
    expect(res.statusCode).toEqual(400) // Check the status code
  })

  it('should delete a person within range', async () => {
    const resAll = await request(app).get('/api/person')
    const personsLength = resAll.body.length

    const id = faker.number.int({ min: 1, max: personsLength })

    const res = await request(app).delete(`/api/person/${id}`)
    expect(res.statusCode).toEqual(200) // Check the status code
  })

  it('should not delete a person out of range', async () => {
    const resAll = await request(app).get('/api/person')
    const personsLength = resAll.body.length

    const id = faker.number.int({ min: personsLength + 1 })

    const res = await request(app).delete(`/api/person/${id}`)
    expect(res.statusCode).toEqual(404) // Check the status code
  })
})
