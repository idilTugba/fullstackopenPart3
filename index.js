const http = require('http');
const express = require('express')

let notes = [
    {
      id: "1",
      content: "HTML is easy beya",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })
const app = express();
app.use(express.json())

app.get('/',(request,response) => {
  response.send('Hello World')
})

app.get('/api/notes',(request,response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find(item => item.id === id)
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (req,res) => {
  const id = req.params.id;
  const note = notes.find(note => note.id !== id )
  res.status(204).end()
}
)

const generateNewID = () => {
    const maxID = notes.length > 0 ? Math.max(...notes.map(note => Number(note.id))) : 0
    return String(maxID +1); 
}


app.post('/api/notes', (req,res) => {
    const noteData = req.body;
    if(!noteData.content){
        return res.status(400).json({error: "data missing"})
    }

    const note = {
        content: noteData.content,
        important: noteData.important || false,
        id: generateNewID()
    }

    notes.concat(note)
    console.log(note)
    res.json(note)
}
)

const PORT = 3001;
app.listen(PORT,() => {
    console.log('Server running on port ')
});
