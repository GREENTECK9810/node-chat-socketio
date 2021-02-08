const mongoose = require('mongoose')

const onlineUserSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
        unique : true
    },
    sockets : [{
        socket : {
            type : String,
            required : true
        }
    }]
})

const onlineUser = mongoose.model('onlineUser', onlineUserSchema)

module.exports = onlineUser