import { Request, Response } from 'express'
import { executeSqlAll } from '../utils/execute'

/**
 * Retrieves all logs from the database and sends them as a JSON response.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export function getLogs (req: Request, res: Response) {
  // Prepare the SQL query
  const sql = 'SELECT * FROM RequestLog ORDER BY id DESC'

  // Execute the SQL query and retrieve the results
  executeSqlAll(sql, req.query, res, rows => {
    return res.status(200).json(rows)
  })
}
