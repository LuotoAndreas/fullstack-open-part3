const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));
app.use(express.json())
app.use(cors())

morgan.token('reqBody', (req, res) => {
  return JSON.stringify(req.body)
})


let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
  ]
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else{
        response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  }) 

  const generateId = () => {
    let newId
    do {
      newId = Math.floor(Math.random() * 100000) + 1
    } while (persons.some(person => person.id === newId))

    return newId
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number ) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
    if (persons.some(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    response.json(person);
})

  app.get('/info', (request, response) => {
    const numberOfContacts = persons.length
    const currentDate = new Date()
    response.send(`
      <p>Phonebook has info for ${numberOfContacts} people</p>
      <p>${currentDate}</p
    `)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })