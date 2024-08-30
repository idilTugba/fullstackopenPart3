const http = require('http');
const express = require('express')

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-type': 'application/json'})
//     response.end(JSON.stringify(phonebook))
// })
const app = express();
app.use(express.json())

//Info page
app.get('/info', (req, res) => {
  const currentDate = new Date().toString();
  res.send(`<p>Phonebook has info ${phonebook.length} people</p></br><p>${currentDate}</p>`)
}
)

//GET ALL
app.get('/api/persons',(request,response) => {
  response.json(phonebook)
})

//GET PERSON
app.get('/api/persons/:id', (req,res) => {
  const id = req.params.id;
  const person = phonebook.find(person => person.id === id)
  if(person){
    res.json(person)
  } else{
    res.status(404).json({error: "Check your request id. Looks like something missing"})
  }
}
)

//DELETE PERSON
app.delete('/api/persons/:id', (req,res) => {
  const id = req.params.id;
  const deletePhone = phonebook.find(person => person.id === id)
  if(deletePhone){
    res.status(204).end()
  } else {
    res.status(404).end('The Person Alredy Deleted.')
  }
  
}
)

const generateID = () => {
  maxID = phonebook.length > 0 ? Math.max(...phonebook.map(person => Number(person.id))) : 0
  return String(maxID + 1)
}


//ADD NEW PERSON
app.post('/api/persons', (req,res) => {
  const person = req.body;
  if(!person.name || !person.number) return res.status(404).json({erros: "Missing content."})
    phonebook.concat({name: person.name ,number:person.number, id:generateID()})
  res.json(person)
}
)


const PORT = 3002;
app.listen(PORT,() => {
    console.log('Server running on port ')
});
