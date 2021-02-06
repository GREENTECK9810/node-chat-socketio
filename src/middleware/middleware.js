const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '')
        const id = jwt.verify(token, 'nodesecret').id
        const user = await User.findOne({_id : id})

        if(!user){
            throw new Error
        }

        req.token = token
        req.user = user

        next()

    } catch (error) {
        res.status(500).send('Please authenticate')
    }

}

module.exports = auth