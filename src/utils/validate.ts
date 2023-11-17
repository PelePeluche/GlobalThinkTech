import { Request, Response, NextFunction } from 'express'

/**
 * Validates the ID parameter in the request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 */
export function validateId (req: Request, res: Response, next: NextFunction) {
  // Parse the ID parameter from the request
  const id = parseInt(req.params.id)

  // Check if the parsed ID is not a number
  if (isNaN(id)) {
    return res.status(400).json({ message: 'id must be a number' })
  }

  next()
}

/**
 * Validates the person information in the request body.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to call.
 */
export function validatePerson (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract the first_name, last_name, and email from the request body
  const { first_name, last_name, email } = req.body

  // Check if any of the required fields is missing
  if (!first_name || !last_name || !email) {
    return res
      .status(400)
      .json({ message: 'first_name, last_name, and email are required' })
  }

  next()
}

/**
 * Check if an object is of type Person.
 *
 * @param {any} obj - The object to be checked.
 *
 * @returns True if the object is of type Person, false otherwise.
 */
export function isPerson (obj: any): obj is Person {
  // Check if all properties of the object have the correct types
  return (
    typeof obj.id === 'number' &&
    typeof obj.first_name === 'string' &&
    typeof obj.last_name === 'string' &&
    typeof obj.email === 'string' &&
    (typeof obj.birthdate === 'string' || obj.birthdate === null) &&
    (typeof obj.bio === 'string' || obj.bio === null) &&
    (typeof obj.lucky_number === 'number' || obj.lucky_number === null)
  )
}
