import { filterFieldsToArray, filterFieldsToObject } from './filters'

describe('Filters', () => {
  describe('filterFieldsToArray', () => {
    it('should filter fields of each object in the array', () => {
      const objects = [
        {
          name: 'John Doe',
          age: 30,
          email: 'john.doe@example.com'
        },
        {
          name: 'Jane Doe',
          age: 25,
          email: 'jane.doe@example.com'
        }
      ]

      const fields = ['name', 'age']

      const result = filterFieldsToArray(objects, fields)

      expect(result).toEqual([
        {
          name: 'John Doe',
          age: 30
        },
        {
          name: 'Jane Doe',
          age: 25
        }
      ])
    })
    it('should not filter fields of an empty array', () => {
      const objects: [] = []

      const fields = ['name', 'age']

      const result = filterFieldsToArray(objects, fields)

      expect(result).toEqual([])
    })
  })

  describe('filterFieldsToObject', () => {
    it('should filter fields of an object', () => {
      const obj = {
        name: 'John Doe',
        age: 30,
        email: 'john.doe@example.com'
      }

      const fields = ['name', 'age']

      const result = filterFieldsToObject(obj, fields)

      expect(result).toEqual({
        name: 'John Doe',
        age: 30
      })
    })

    it('should not filter fields of an empty object', () => {
      const obj = {}

      const fields = ['name', 'age']

      const result = filterFieldsToObject(obj, fields)

      expect(result).toEqual({})
    })

    it('should not filter fields that do not exist', () => {
      const obj = {
        name: 'John Doe',
        age: 30,
        email: 'john.doe@example.com'
      }

      const fields = ['wrong_field', 'age']

      const result = filterFieldsToObject(obj, fields)

      expect(result).toEqual({
        age: 30
      })
    })
  })
})
