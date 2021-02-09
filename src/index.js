const express = require('express')
const userRoute = require('./routers/user')
// const http = require('http')
const socketio = require('socket.io')
const User = require('./models/users')
const OnlineUser = require('./models/onlineUsers')
const onlineUser = require('./models/onlineUsers')
require('./db/mongoose')


const port = 3000

const app = express()
app.use(express.json())
app.use(userRoute)


const server = app.listen(port, () => {
    console.log('listening on port '+ port)
})
const io = socketio(server)



io.on('connection',  (socket) => {

    console.log('new connection : ' + socket.id)
    console.log(`user ${socket.handshake.query.username} connected`)
    addUserToOnlineUsers(socket.handshake.query.username, socket.id)

    socket.on('message', () => {
        console.log("message connect")
    })

    //sends private message
    socket.on('private message', (message) => {
        
        console.log(message.from + " " + message.to + " " + message.message)
        sendPrivateMessage(socket, message)
        //socket.to(anotherSocketId).emit("private message", socket.handshake.query.username, message);


    })

    socket.on('disconnect', (reason) => {
        console.log('disconnected')
        deleteUserFromOnlineUser(socket.handshake.query.username)
    })

})

const addUserToOnlineUsers = async (username, socket) => {
    try {
        const onlineUser = new OnlineUser({username})
        onlineUser.sockets = onlineUser.sockets.concat({socket})
        await onlineUser.save()
        console.log('saved')
        return true
    } catch (error) {
        console.log('not saved')
        return false
    }
    
}

const deleteUserFromOnlineUser = async (username) => {
    try {
        await OnlineUser.findOneAndDelete({username})
        console.log('online user deleted')
        return true
    } catch (error) {
        console.log('unable to delete online user : ' + error)
        return false
    }
}


const sendPrivateMessage = async (socket, message) => {
    try {
        const user = await OnlineUser.findOne({username : message.to})
        const sockets = user.sockets
        if(user !== null){
            sockets.forEach(element => {
                socket.to(element.socket).emit("private message", {username : message.from, message: message.message})
            });
            
        }
    } catch (error) {
        console.log('unable to find user')
    }
}




