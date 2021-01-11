const mongoose = require('mongoose')
const Departement = mongoose.model('Departement')
const bcrypt = require('bcryptjs')

exports.new = async (req, res) => {
    const { name} = req.body

    const isDepartementExist =await Departement.findOne({name})
    if (isDepartementExist) throw "Un departement avec le même nom existe déjà." 

    const depart = new Departement({name})
    await depart.save()

    res.json({
        message: 'Departement enregistré avec succès.'
    })
}

exports.list = async (req, res) => {
    const departements =await Departement.find()
    const data = []
    
    departements.forEach((departement, key) => {
        data.push({
            key: key + 1,
            _id: departement.id,
            name: departement.name
        })
    })

    data.sort((a, b) => b['key'] - a['key'])
    res.json({
        departements:data
    })
}

exports.edit = async (req, res) => {
    const id = req.params.id
    const { name} = req.body
    const departement =await Departement.findOne({_id:id})
    if (name) departement.name = name
    
    await departement.save()

    res.json({
        message: 'Departement modifie avec succès.'
    })
}

exports.delete = async (req, res) => {
    const id = req.params.id
    const departement =await Departement.findOne({_id:id})
    if (!departement) 
        throw "Departement non trouver." 

    await departement.remove()

    res.json({
        message: 'Departement supprimer avec succès.'
    })
}