const express=require('express')
const app=express()
const path=require('path')
const http =require('http')
const port=process.env.PORT||3000
const socketio=require('socket.io')
const {GenerateMessages}=require('./utils/GenerateMessage') //for requiring single property of exported data
const {getUser,getUserRoom,removeUser,AddUser}=require('./utils/users')

PublicDirectoryPath=path.join(__dirname,'../public')
// ViewsDirectoryPath=path.join(__dirname,'../views')
app.use(express.static(PublicDirectoryPath))

const server=http.createServer(app)
const io=socketio(server)


app.get('',(req,res)=>{
    res.send("aaao")
})

//server emit(counUpdated)->client recieve(countUpdated)
//client emtit(incremented(through clicking))->server recieve(increment value and update for every connection using io.emit)

io.on('connection',(socket)=>{
    
    console.log("New connection added")

    socket.on('join',({username,room},callback)=>{
        const {error,user}=AddUser({id:socket.id,username,room})
        if(!user){
          return  callback(error)
        }
            
        socket.join(user.room)

        socket.emit('message',GenerateMessages(`Welcome ${user.username}`))
        socket.broadcast.to(user.room).emit('message',GenerateMessages('Admin',`${user.username} has Joined`))//except this user everyone will be notified about this event
        
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserRoom(user.room)
        })

        callback()
    })
   
    socket.on('SendMessage',(msg,callback)=>{
        const user=getUser(socket.id)
        if(!user)
          return  callback('not sent')
        io.to(user.room).emit('message',GenerateMessages(user.username,msg))//need to change
       callback('Delivered !')
    })

    socket.on('SendLocation',(position,callback)=>{
        const user=getUser(socket.id)
        if(!user)
            return  callback('not sent')
        io.to(user.room).emit('LocationMessage',GenerateMessages(user.username,`https://google.com/maps/place/${position.lattitude},${position.longitude}`))
        callback('Delivered!')
    })
    
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
           
            io.to(user.room).emit('message',GenerateMessages('Admin',`${user.username} has let the Chat`))//no need for broadcast as one of the is already disconnected hence will not get this mesage
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserRoom(user.room)
            })
        }
    }) 

})

server.listen(port,()=>{
    console.log(`Server is listening on Port ${port}`)
})