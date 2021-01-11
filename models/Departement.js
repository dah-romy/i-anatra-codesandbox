const mongoose = require('mongoose')

const departementSchema = mongoose.Schema({
    name:{
        type: String,
        required: "Le nom est requis."
    }
})

module.exports = mongoose.model('Departement', departementSchema)