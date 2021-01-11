const mongoose = require('mongoose')
const User = mongoose.model('User')
const Participant = mongoose.model('Participant')
const Conversation = mongoose.model('Conversation')
const bcrypt = require('bcryptjs')
const constant = require('../utils/constants')
const UserRepository = require('../repository/userRepository')

exports.list = async (req, res) => {
    const users = await User.find({})
    const data = []

    users.forEach((user, key) => {
        if (user.email !== 'admin@i-anatra.io'){
            data.push({
                key: key,
                id: user._id,
                lastname: (user.lastname) ? user.lastname : '',
                firstname: (user.firstname) ? user.firstname : '',
                email: user.email,
                role: (user.role === 0) ? 'Administrateur': (user.role === 1) ? 'Professeur' : 'Etudiant'
            })
        }
    })

    data.sort((a,b) => b['key']-a['key'])
    res.json({
        data
    })
}

exports.contacts = async (req, res) => {
    const users = await User.find({})
    const data = []
    let key = 0

    for (const user of users){
        if (user.id !== req.payload.id){
            let conversationId = await UserRepository.findOurConversation(req.payload.id, user._id)

            if (conversationId == ""){
                const ourConversation = new Conversation({})
                await ourConversation.save()

                const myParticipant = new Participant({user: req.payload.id, conversation: ourConversation})
                const otherParticipant = new Participant({user: user, conversation: ourConversation})
                await myParticipant.save()
                await otherParticipant.save()

                conversationId = ourConversation._id
            }

            const conversation = await Conversation.findOne({_id: conversationId})
            const pps = await Participant.find({conversation: conversation})
            let name = "";

            for (const pp of pps){
                if (pp.user != req.payload.id){
                    const usr = await User.findOne({_id: pp.user})
                    name += usr.firstname + ','
                }
            }

            data.push({
                key: key,
                id: user._id,
                status: user.status,
                lastname: (user.lastname) ? user.lastname : '',
                email: user.email,
                firstname: (user.firstname) ? user.firstname : '',
                role:(user.role),
                conversation: {
                    key: key,
                    id: conversation._id,
                    name: name,
                    name: (conversation.name) ? conversation.name : name,
                    status: user.status
                }
            })

            key += 1
        }
    }

    res.json({
        data
    })
}

exports.new = async (req, res) => {
    const {email, lastname, firstname, role} = req.body

    this.regex(email, lastname, firstname)

    const userExist = await User.findOne({email})
    if (userExist) throw "Un utilisateur avec le même e-mail existe déjà"

    const salt = await bcrypt.genSalt(10)
    const user = new User({email, password: await bcrypt.hash("123456789", salt), lastname, firstname, role})

    req.io.sockets.emit("contacts", user);

    await user.save()

    res.json({
        message: constant.ADD_USER_SUCCESS
    })
}

exports.getUser = async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({ _id: id })
    res.json({
        user: user
    })
}

exports.edit = async (req, res) => {
    const {email, lastname, firstname, role} = req.body
    const id = req.params.id

    this.regex(email, lastname, firstname)

    const user = await User.findOne({ _id: id })
    const users = await User.find({})
    const data = []

    users.forEach(usr => {
       if(user.email !== usr.email) data.push(usr.email)
    })

    if (data.includes(email)) throw "Un utilisateur avec le même e-mail existe déjà."

    try {
        user.email = email
        user.lastname = lastname
        user.firstname = firstname
        user.role = role

        await user.save()

        res.json({
            message: 'Utilisateur modifié avec succès.'
        })

	} catch {
		throw "Erreur de la modification de l'utilisateur."
	}
}

exports.delete = async (req, res) => {
    const id = req.params.id

    try {
        await User.deleteOne({ _id: id })

		res.json({
            message: 'Utilisateur supprimé avec succès.'
        })
	} catch {
		throw "Erreur de la suppression de l'utilisateur."
	}
}

exports.regex = (email, lastname, firstname) => {
    var nameRegex = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/
    var emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (!emailRegex.test(email)) throw 'Email invalide.'
    if (!nameRegex.test(lastname)) throw 'Nom invalide.'
    if (!nameRegex.test(firstname)) throw 'Prenom invalide.'
}
