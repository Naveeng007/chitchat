const express=require('express')
const app=express()
const path=require('path')
const http =require('http')
const port=process.env.PORT||3000
const socketio=require('socket.io')
let count=0

PublicDirectoryPath=path.join(__dirname,'../public')
// ViewsDirectoryPath=path.join(__dirname,'../views')
app.use(express.static(PublicDirectoryPath))

const server=http.createServer(app)
const io=socketio(server)


app.get('',(req,res)=>{
    res.send("aaao")
})


io.on('connection',(socket)=>{
    
    console.log("New connection added",count)
    socket.emit('countUpdated',count)
    socket.on('increment',()=>{
        count++;
        socket.emit("countUpdated",count)
    })

})

server.listen(port,()=>{
    console.log(`Server is listening on Port ${port}`)
})