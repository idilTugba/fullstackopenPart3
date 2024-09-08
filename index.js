require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const morganBody = require('morgan-body')
const Phonebook = require('./models/phonebook')

let phonebook = []

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-type': 'application/json'})
//     response.end(JSON.stringify(phonebook))
// })

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
// app.use(morgan('combined'));
// morganBody(app);
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))


//Info page
app.get('/info', (req, res) => {
  const currentDate = new Date().toString()
  res.send(`<p>Phonebook has info ${phonebook.length} people</p></br><p>${currentDate}</p>`)
})

//GET ALL
app.get('/api/persons',(request,response, next) => {
  // response.json(phonebook)
  Phonebook.find({}).then(persons => {
    if(persons){
      phonebook.push(persons)
      response.json(persons)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

//GET PERSON
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Phonebook.findById(id).then(result => {
    if(result){
      res.json(result)
    } else{
      res.status(404).json({error: 'Check your request id. Looks like something missing'})
    }
  }).catch(error => next(error))
  
})

//DELETE PERSON
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Phonebook.findByIdAndDelete(id).then(item => {
    if(item){
      res.status(204).end()
    } else {
      res.status(404).json({error:'The Person Alredy Deleted.'})
    }
  }).catch(error => next(error))
})

// const generateID = () => {
//   maxID = phonebook.length > 0 ? Math.max(...phonebook.map(person => Number(person.id))) : 0
//   return String(maxID + 1)
//   const id = Math.floor(Math.random()*10)
// }

//ADD NEW PERSON
app.post('/api/persons', (req, res, next) => {
  const data = req.body
  if(!data.number) return res.status(400).json({error: 'Phonenumber is missing.'})
  if(!data.name ) return res.status(400).json({error: 'Name is missing.'})
  if(phonebook.find(person => person.name === data.name)) return res.status(404).json({error: 'Name is already exist.'})
  const person = new Phonebook({
    name: data.name,
    number: data.number
  })
  person.save().then(item => {
    res.json(item)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const data = req.body
  if(!data.name) return res.status(400).json({error:'Name not exist'})
  if(!data.number) return res.status(400).json({error:'Number not exist'})
  const person = {
    name : data.name,
    number: data.number
  }

  Phonebook.findByIdAndUpdate(id, person, {new: true, runValidators: true, context: 'query' }).then(updateNow => {
    if(updateNow){
      res.json(updateNow)
    }else {
      res.status(404).json({error:'The Person already updated!'})
    }
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error:'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error)
  if(error.name === 'CastError'){
    response.status(400).send({ error:'malformatted id'})
  } else if(error.name === 'ValidationError') {
    response.status(400).send({error: error.message})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT,() => {
  console.log('Server running on port')
})