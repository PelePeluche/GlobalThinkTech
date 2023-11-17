import { Request, Response } from 'express'
import { executeSqlAll, executeSqlGet, executeSqlRun } from '../utils/execute'
import {
  filterFields,
  filterFieldsToArray,
  filterFieldsToObject
} from '../utils/filters'

/**
 * Retrieves all persons from the database and filters the result based on the request query parameters.
 *
 * @param {Request} req - The request object containing the query parameters.
 * @param {Response} res - The response object to send the filtered rows as JSON.
 */
export function getPersons (req: Request, res: Response) {
  // Prepare the SQL query
  const sql = 'SELECT * FROM Person'

  // Execute the SQL query, filter the result and pass the  rows to the callback function
  executeSqlAll(sql, req.query, res, rows => {
    const filteredRows = filterFields(req, rows, filterFieldsToArray)

    return res.status(200).json(filteredRows)
  })
}

/**
 * Get a person by their ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export function getPerson (req: Request, res: Response) {
  const { id } = req.params

  // Prepare the SQL query
  const sql = 'SELECT * FROM Person WHERE id = ?'

  // Execute the SQL query, filter the result and pass the  row to the callback function
  executeSqlGet(sql, [id], res, row => {
    if (!row) {
      return res.status(404).json({ message: 'Person not found' })
    }

    const filteredRow = filterFields(req, row, filterFieldsToObject)

    return res.status(200).json(filteredRow)
  })
}
/**
 * Creates a new person in the database.
 *
 * @param {Request} req - The request object containing the person data.
 * @param {Response} res - The response object to send the result.
 */
export function createPerson (req: Request, res: Response) {
  const { first_name, last_name, email, birthdate, bio } = req.body

  // Prepare the SQL query
  const sql = `INSERT INTO Person (first_name, last_name, email, birthdate, bio) VALUES (?, ?, ?, ?, ?)`

  // Execute the SQL query with the person data and handle the result
  executeSqlRun(
    sql,
    [first_name, last_name, email, birthdate, bio],
    res,
    function () {
      return res.status(201).json({ message: 'Successfully created person' })
    }
  )
}

/**
 * Update a person in the database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export function updatePerson (req: Request, res: Response) {
  const { id } = req.params
  const { first_name, last_name, email, birthdate, bio } = req.body

  // Prepare the SQL query
  const sql = `UPDATE Person SET first_name = ?, last_name = ?, email = ?, birthdate = ?, bio = ? WHERE id = ?`

  // Execute the SQL query with the provided data
  executeSqlRun(
    sql,
    [first_name, last_name, email, birthdate, bio, id],
    res,
    (dbRunContext: any) => {
      // If no rows were affected, person not found
      if (dbRunContext.changes === 0) {
        return res.status(404).json({ message: 'Person not found' })
      }

      return res.status(200).json({ message: 'Successfully updated person' })
    }
  )
}

/**
 * Deletes a person from the database.
 *
 * @param {Request} req - The request object containing the person's ID.
 * @param {Response} res - The response object to send the result.
 */
export function deletePerson (req: Request, res: Response) {
  const { id } = req.params

  // Prepare the SQL statement
  const sql = `DELETE FROM Person WHERE id = ?`

  // Execute the SQL statement with the given ID as a parameter
  executeSqlRun(sql, [id], res, (dbRunContext: any) => {
    // If no rows were affected, person not found
    if (dbRunContext.changes === 0) {
      return res.status(404).json({ message: 'Person not found' })
    }

    return res.status(200).json({ message: 'Successfully deleted' })
  })
}
