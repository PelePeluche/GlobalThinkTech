import { Request, Response, NextFunction } from 'express'
import { executeSqlRun } from '../utils/execute'

/**
 * Middleware function to log incoming requests.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call.
 */
export function logRequest (req: Request, res: Response, next: NextFunction) {
  // Check if the request path is not '/api/logs'
  if (req.path !== '/api/logs') {
    // Get props from request
    const { method, url } = req
    const timestamp = new Date().toISOString()

    // Prepare SQL query to insert request log into database
    const sql = `INSERT INTO RequestLog (method, url, timestamp) VALUES (?, ?, ?)`

    // Execute SQL query to insert request log into database
    executeSqlRun(sql, [method, url, timestamp], res, function () {
      console.log(
        `Received a ${req.method} request for ${req.url} at ${timestamp}`
      )
    })
  }
  next()
}
