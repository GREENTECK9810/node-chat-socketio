const User = require('../models/users')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/middleware')


//create user endpoint
router.post('/users', async(req, res) => {
    const user = new User(req.body)
    //console.log(user)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        //console.log(token)
        res.status(201).send({user, token})
        //const token = user.ge
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

//login user endpoint
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (e) {
        res.status(404).send({e})
    }


})

//logout user endpoint
router.get('/users/logout', auth, async(req, res) => {

    try {
        const user = req.user
        user.tokens = user.tokens.filter((token) => token.token !== req.token)
        await req.user.save() 
        
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }

})

//get user
router.get('/users/user', auth, async(req, res) => {
    console.log('find user')
    try {
        const user = await User.findOne({username : req.query.username})
        res.status(200).send(user)
    } catch (error) {
        res.status(404).send(error)
    }
    
    
})

//add firebase token
router.get('/users/firebasetoken', auth, async (req, res) => {

    try {
        const user = req.user
        user.firebasetoken = req.query.firebaseToken
        console.log('token added : ' + user.firebasetoken)
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router