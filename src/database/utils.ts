import { faker } from '@faker-js/faker'

/**
 * Creates a person object with random data.
 *
 * @returns {NewPerson} The created person object.
 */
export function createPerson (): NewPerson {
  // Generate randoms attributes for the person
  const first_name = faker.person.firstName()
  const last_name = faker.person.lastName()
  const email = faker.internet.email({
    firstName: first_name,
    lastName: last_name
  })
  const birthdate = faker.datatype.boolean()
    ? faker.date.birthdate().toISOString()
    : undefined
  const bio = faker.datatype.boolean() ? faker.person.bio() : undefined
  const lucky_number = faker.datatype.boolean()
    ? faker.number.int({ min: 1, max: 100 })
    : undefined

  // Return the created person object
  return { first_name, last_name, email, birthdate, bio, lucky_number }
}

/**
 * Handles errors and logs the error message if an error occurs.
 *
 * @param {Error | null} err - The error object to handle. Can be null.
 *
 * @returns True if an error occurred, false otherwise.
 */
export function handleError (err: Error | null): boolean {
  if (err) {
    console.error(err.message)
    return true
  }
  return false
}
