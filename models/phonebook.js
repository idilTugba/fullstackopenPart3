const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)

mongoose.connect(url).then(result => 
  {console.log("Conttected")}
).catch(error => {
  console.log('error connecting to MongoDB ', error.message)
})

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)


// if (process.argv.length===3) {
//     Phonebook.find({}).then(result => {
//         result.forEach(element => {
//             console.log(element)
//         });
//         mongoose.connection.close();
//     })
//   } else {
//     const name = process.argv[3]
//     const number = process.argv[4]

//     const phonebook = new Phonebook({
//         name: name, 
//           number: number
//       })

//     phonebook.save().then(result => {
//         console.log( `${result.name} added to db with ${result.number}`)
//         mongoose.connection.close()
//       })
//   }


  

