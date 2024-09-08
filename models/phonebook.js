const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)

mongoose.connect(url).then(result => 
  {console.log("Conttected")}
).catch(error => {
  console.log('error connecting to MongoDB ', error.message)
})

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'number could be at least 8 characters.'],
    validate: {
      validator: function(v) {
        return /^\d{1,3}-\d{0,10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Format should be like 09-1234567 or 040-22334455.`
    },
    required: true
  },
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


  

