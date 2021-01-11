const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: 'Le contenu du message est requis.'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'L\'autheur du message est requis.',
        ref: 'User'
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Le message devra etre dans une conversation.',
        ref: 'Conversation'
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Message', messageSchema)