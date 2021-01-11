const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
    name: {
        type: String,
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Conversation', conversationSchema)