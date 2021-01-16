const socket=io()

socket.on('countUpdated',(count)=>{//socket.on on client side
    console.log("count updated",count)
})

const q=document.querySelector('#increment')
if(q){
    q.addEventListener('click',()=>{
        console.log("clicked")
        socket.emit('increment')//emit to particular connection
        //use io for every connection to be updated
    })
}
else
{
    console.log('undefinde hai bhaiya')
}
    