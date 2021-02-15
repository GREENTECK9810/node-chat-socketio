const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Timestamp } = require('mongodb')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        required: true,
        trim: true,
        minLength: 7,
        
    },
    username : {
        type : String,
        required : true,
        trim : true,
        minLength : 6,
        unique : true
    },
    firebasetoken : {
        type : String,
        trim : true,
        unique : true,
        minLength: 1
    },
    tokens : [{
        token : {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async function(email, password){
    const user = await User.findOne({email})
    //console.log(user)
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
    
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({id : user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}

userSchema.pre('save', async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
        console.log(user)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

