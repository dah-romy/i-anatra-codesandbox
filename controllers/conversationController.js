const mongoose = require('mongoose')
const User = mongoose.model('User')
const Conversation = mongoose.model('Conversation')
const Message = mongoose.model('Message')
const Participant = mongoose.model('Participant')
const conversationRepository = require('../repository/conversationRepository')

exports.getConversations = async (req, res) => {
  const conversations = await conversationRepository.findUserConversations(req.payload.id);
  return res.json({
    conversations: conversations
  })
}

exports.newConversation = async (req, res) => {
  const {users} = req.body
  users.push(req.payload.id)

  const data = []

  const conversation = new Conversation()
  await conversation.save()

  for (const user of users){
    const participant = new Participant({user: user, conversation: conversation})
    await participant.save()
  }

  const pps = await Participant.find({conversation: conversation})
  let name = "";
  let status = []

  for (const pp of pps){
      if (pp.user != req.payload.id){
          const user = await User.findOne({_id: pp.user})
          name += user.firstname + ','
          status.push(user.status)
      }
  }

  data.push({
      key: 0,
      id: conversation._id,
      status: (status.includes(true)) ? true : false,
      name: (conversation.name) ? conversation.name : name
  })

  req.io.sockets.emit("conversations", data[0]);

  res.json({conversation: data[0]})
}

exports.getConversationMessages = async (req, res) => {
  const {id} = req.body
  const conversation = await conversationRepository.findConversationById(id)

  const messages = await Message.find({conversation: conversation})

  res.json({
    messages: messages
  })
}