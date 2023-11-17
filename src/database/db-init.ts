import { Database } from 'sqlite3'
import { handleError, createPerson } from './utils'

// Create a new instance of an in-memory SQLite database
const db = new Database(':memory:', err => {
  if (handleError(err)) return

  console.log('Connected to the in-memory SQLite database.')
})

// Prepare the SQL statements to create the tables
const sqlRequestLog =
  'CREATE TABLE RequestLog (id INTEGER PRIMARY KEY, method TEXT, url TEXT, timestamp TEXT)'
const sqlPerson =
  'CREATE TABLE Person (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, birthdate TEXT, bio TEXT, lucky_number INTEGER)'

// Run the SQL statements to create the tables and insert data
const initDb = Promise.all([
  new Promise((resolve, reject) => {
    db.run(sqlRequestLog, err => {
      if (err) reject(err)
      else resolve(void 0)
    })
  }),
  new Promise((resolve, reject) => {
    db.run(sqlPerson, err => {
      if (err) reject(err)
      else {
        // Generate and insert 50 random person records
        for (let i = 0; i < 50; i++) {
          const person = createPerson()
          insertPerson(db, person)
        }
        resolve(void 0)
      }
    })
  })
])

// Export the database instance and the initialization promise
export { db, initDb }

/**
 * Inserts a person into the database.
 *
 * @param {Database} db - The SQLite database.
 * @param {NewPerson} person - The person object to insert.
 */
function insertPerson (db: Database, person: NewPerson) {
  // Prepare the SQL statement
  const sql = `
    INSERT INTO Person (first_name, last_name, email, birthdate, bio, lucky_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  // Execute the SQL statement with the person object values
  db.run(
    sql,
    [
      person.first_name,
      person.last_name,
      person.email,
      person.birthdate,
      person.bio,
      person.lucky_number
    ],
    handleError
  )
}
