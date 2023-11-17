import { Request } from 'express'

/**
 * Filters the given data based on the requested fields.
 *
 * @param {Request} req - The request object.
 * @param {Rows | Row} data - The data to be filtered.
 * @param {Function} filterFunc - The filter function to be applied.
 *
 * @returns {Rows | Row} - The filtered data.
 */
export function filterFields (
  req: Request,
  data: Rows | Row,
  filterFunc: Function
): Rows | Row {
  // Get the requested fields from the query parameters and initialize the filtered data
  const fields = req.query.fields
  let filteredData = data

  // Check if the requested fields is a string and filter the data accordingly the fields and the filter function
  if (typeof fields === 'string') {
    const requestedFields = fields.split(',')
    filteredData = filterFunc(data, requestedFields)
  }

  return filteredData
}

/**
 * Filters the fields of each object in the array and returns a new array
 *
 * @param {Rows} objects - The array of objects to filter
 * @param {Fields} fields - The fields to keep in each object
 *
 * @returns The new array of filtered objects
 */
export function filterFieldsToArray (objects: Rows | [], fields: Fields): Rows {
  try {
    return objects.map(obj => filterFieldsToObject(obj, fields))
  } catch (error) {
    console.error(`Error filtering fields to array: ${error}`)
    return []
  }
}

/**
 * Filters the fields of an object and returns a new object with only the specified fields.
 *
 * @param {Row} obj - The original object.
 * @param {Fields} fields - An array of fields to filter.
 *
 * @returns A new object with only the specified fields.
 */
export function filterFieldsToObject (obj: Row, fields: Fields): Row {
  try {
    let newObj: Row = {}

    // Iterate over each field
    fields.forEach(field => {
      // Check if the object has the current field
      if (obj.hasOwnProperty(field)) {
        // Copy the field to the new object
        newObj[field] = obj[field]
      }
    })

    return newObj
  } catch (error) {
    console.error(`Error filtering fields to object: ${error}`)
    return {}
  }
}
