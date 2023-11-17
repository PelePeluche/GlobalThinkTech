type Person = {
  id: number
  first_name: string
  last_name: string
  email: string
  birthdate?: string
  bio?: string
  lucky_number?: number
}

type NewPerson = Omit<Person, 'id'>

type Row = Record<string, unknown>

type Rows = Array<Row>

type Fields = Array<string>
