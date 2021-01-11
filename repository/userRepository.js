const mongoose = require('mongoose')
const User = mongoose.model('User')
const Message = mongoose.model('Message')
const Participant = mongoose.model('Participant')
const Conversation = mongoose.model('Conversation')

exports.findOurConversation = async (id, other) => {
    const me = await User.findOne({_id : id})
    const user = await User.findOne({_id : other})
    let data = '';

    const myParticipants = await Participant.find({user: id})
    const otherParticipants = await Participant.find({user: other})

    for (const myParticipant of myParticipants){
        for (const otherParticipant of otherParticipants){

            const myConversation = await Conversation.findOne({_id: myParticipant.conversation})
            const otherConversation = await Conversation.findOne({_id: otherParticipant.conversation})

            if (myConversation.id == otherConversation.id) {
                const pps =await Participant.find({conversation: myConversation})
                if (pps.length < 3){
                    data = myParticipant.conversation
                }
            }
        }
    }

    return data
}