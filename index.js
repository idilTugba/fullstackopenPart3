require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const morganBody = require('morgan-body')
const Phonebook = require('./models/phonebook')

let phonebook = []

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-type': 'application/json'})
//     response.end(JSON.stringify(phonebook))
// })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const app = express();
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
  const currentDate = new Date().toString();
  res.send(`<p>Phonebook has info ${phonebook.length} people</p></br><p>${currentDate}</p>`)
}
)

//GET ALL
app.get('/api/persons',(request,response) => {
  // response.json(phonebook)
  Phonebook.find({}).then(persons => {
    phonebook.push(persons)
    response.json(persons)
  })
})

//GET PERSON
app.get('/api/persons/:id', (req,res) => {
  const id = req.params.id;
  Phonebook.findById(id).then(result => {
    res.json(result)
  })
  
    // res.status(404).json({error: "Check your request id. Looks like something missing"})
}
)

//DELETE PERSON
app.delete('/api/persons/:id', (req,res) => {
  const id = req.params.id;
  Phonebook.findByIdAndDelete(id).then(item => {
    res.json(item)
  })
  // res.status(404).end('The Person Alredy Deleted.')
  
}
)

const generateID = () => {
  maxID = phonebook.length > 0 ? Math.max(...phonebook.map(person => Number(person.id))) : 0
  return String(maxID + 1)
  const id = Math.floor(Math.random()*10)
}


//ADD NEW PERSON
app.post('/api/persons', (req,res) => {
  const data = req.body;
  if(!data.number) return res.status(404).json({erros: "Phonenumber is missing."})
  if(!data.name ) return res.status(404).json({erros: `Name is missing.`})
  if(phonebook.find(person => person.name === data.name) ) return res.status(404).json({erros: `Name is already exist.`})
    const person = new Phonebook({
      name: data.name ,
      number:data.number
    })
    person.save().then(item => {
      res.json(item)
    })
}
)

app.use(unknownEndpoint)

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log('Server running on port ')
});
