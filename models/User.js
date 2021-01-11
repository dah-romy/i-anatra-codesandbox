const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: 'L\'adresse email est requis.'
    },
    password: {
        type: String,
        required: "Le mot de passe est requis."
    },
    firstname:{
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    status:{
        type: Boolean,
        default: false
    },
    role: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('User', userSchema)