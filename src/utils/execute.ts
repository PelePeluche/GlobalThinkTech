import { Response } from 'express'
import { db } from '../database/db-init'

/**
 * Executes an SQL query with the given parameters and handles any errors that occur.
 *
 * @param {string} sql - The SQL query to execute.
 * @param {any} params - The parameters for the SQL query.
 * @param {Response} res - The response object to send the result to.
 * @param {Function} callback - The callback function to execute after the query is executed.
 */
export function executeSqlRun (
  sql: string,
  params: any,
  res: Response,
  callback: any
) {
  // Execute the SQL query
  db.run(sql, params, function (err) {
    if (err) {
      return handleDatabaseError(err, res)
    }

    callback(this)
  })
}

/**
 * Executes an SQL query and retrieves a single row of data.
 *
 * @param {string} sql - The SQL query to execute.
 * @param {any} params - The parameters to bind to the query.
 * @param {Response} res - The response object to handle any errors.
 * @param {(row: any) => void} callback - The callback function to handle the retrieved row.
 */
export function executeSqlGet (
  sql: string,
  params: any,
  res: Response,
  callback: (row: any) => void
) {
  // Execute the SQL query
  db.get(sql, params, function (err, row) {
    if (err) {
      return handleDatabaseError(err, res)
    }

    callback(row)
  })
}

/**
 * Executes a SQL query and returns all rows.
 *
 * @param {string} sql - The SQL query to execute.
 * @param {any} query - The query parameters.
 * @param {Response} res - The response object.
 * @param {(rows: any[]) => void} callback - The callback function to handle the rows.
 */
export function executeSqlAll (
  sql: string,
  query: any,
  res: Response,
  callback: (rows: any[]) => void
) {
  // Extract the page number and page size from the query parameters
  const page = parseInt(query?.page) || 1
  const pageSize = parseInt(query?.pageSize)

  // Calculate the offset based on the page and page size
  const offset = (page - 1) * pageSize

  // Generate the paginated SQL query
  const paginatedSql =
    pageSize >= 0 && page >= 1
      ? `${sql} LIMIT ${pageSize} OFFSET ${offset}`
      : sql

  // Execute the SQL query
  db.all(paginatedSql, function (err, rows) {
    if (err) {
      return handleDatabaseError(err, res)
    }

    callback(rows)
  })
}

/**
 * Handles a database error by sending an appropriate response.
 *
 * @param {Error | null} err - The error object representing the database error.
 * @param {Response} res - The response object to send the error message to.
 */
function handleDatabaseError (err: Error | null, res: Response) {
  if (err) {
    return res.status(500).json(err.message)
  }
}
