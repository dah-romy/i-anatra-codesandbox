const mongoose = require('mongoose')

const participantSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Un participant devra etre un utilisateur.',
        ref: 'User'
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Un participant devra etre dans une conversation.',
        ref: 'Conversation'
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Participant', participantSchema)