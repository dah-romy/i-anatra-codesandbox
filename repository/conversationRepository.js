const mongoose = require('mongoose')
const User = mongoose.model('User')
const Participant = mongoose.model('Participant')
const Conversation = mongoose.model('Conversation')

exports.findUserConversations = async (id) => {
    const participants = await Participant.find({user : id})
    const me = await User.findOne({_id : id})
    const data = [];
    let key = 0

    for (const participant of participants) {
        const conversation = await Conversation.findOne({_id: participant.conversation})
        const pps = await Participant.find({conversation: conversation})
        let name = "";
        let status = []

        for (const pp of pps){
            if (pp.user != me.id){
                const user = await User.findOne({_id: pp.user})
                name += user.firstname + ','
                status.push(user.status)
            }
        }

        data.push({
            key: key,
            id: conversation._id,
            status: (status.includes(true)) ? true : false,
            name: (conversation.name) ? conversation.name : name
        })

        key = key + 1
    }

    return data
}

exports.findConversationById = async (id) => {
    const conversation = await Conversation.findOne({_id: id})
    return conversation
}

exports.getConversationDetails = async (id, conversation) => {

    const data = []

    const pps = await Participant.find({conversation: conversation})
    let name = "";
    let status = []

    for (const pp of pps){
        if (pp.user != id){
            const user = await User.findOne({_id: pp.user})
            name += user.firstname + ','
            status.push(user.status)
        }
    }

    data.push({
        key: key,
        id: conversation._id,
        status: (status.includes(true)) ? true : false,
        name: (conversation.name) ? conversation.name : name
    })

    return data
}