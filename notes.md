# to start devlopment in chichat directory u can use npm run dev or npm run start to start server(index.js) with node

* server emit(counUpdated)->client recieve(countUpdated)
* client emtit(incremented(through clicking))->server recieve(increment value and update for every connection using io.emit)

``` js
socket.emit('countUpdated',count) //emit data to particular connection and sent to client
    socket.on('increment',()=>{//recive incoming signal from client
        count++;
        // socket.emit("countUpdated",count)//emit to particular connection
        io.emit('countUpdated',count)//emit to every one in  connection
    })

```
``` js
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()//stops Refresh of page
    const msg=e.target.elements.message.value//it is taking nested elements of message-form id..here we are taking element "message" which is id of one of input
    socket.emit('SendMessage',msg)//sending to particular so after catching this on serverside it will broadcast to everyone
})

```