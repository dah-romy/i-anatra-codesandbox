const mongoose = require('mongoose')
const Message = mongoose.model('Message')

exports.getMessages = async (req, res) => {
    const conversation = req.params.id
    const messages = await Message.find({conversation: conversation})
    res.json({messages})
}

exports.sendMessage = async (req, res) => {
    const conversation = req.params.id
    const { message } = req.body

    const msg = new Message({user: req.payload.id, conversation: conversation, content: message})
    await msg.save()

    req.io.sockets.emit("messages", msg);

    res.json(msg)
}