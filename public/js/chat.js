const socket=io()

const $MessageForm=document.querySelector('#message-form');
const $MessageFormButton=document.querySelector('#send_button')
const $MessageInput=document.querySelector('#message')//$ is added just for to show it is for query selector
const $LocationButton=document.querySelector('#send_location')
const $MessageTemplate=document.querySelector('#message_template').innerHTML
const $MessageDiv=document.querySelector('#messages_div')
const $URLTemplate=document.querySelector('#location_url').innerHTML
const sidebarTemplate=document.querySelector('#sidebar_template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})//parsing and removing prefix like '?'

const autoscroll=()=>{
    const $newMessages=$MessageDiv.lastElementChild

    //Height of new Messages

    const newMessagesStyles=getComputedStyle($newMessages)
    const newMessagesMargin=parseInt(newMessagesStyles.marginBottom)
    const newMessageHeight=$MessageDiv.offsetHeight + newMessagesMargin

    //visible Height
    const visibleHeight=$MessageDiv.offsetHeight

    //Height of message Container
    const containerHeight=$MessageDiv.scrollHeight

    //How far i have scrolled?
    const scrollOffset=$MessageDiv.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $MessageDiv.scrollTop=$MessageDiv.scrollHeight
    }
}

socket.on('message',(messages)=>{
    const html=Mustache.render($MessageTemplate,{
        username:messages.username,
        message:messages.text,//some error is here
        time: moment(messages.time).format('h:mm a')
    })
    $MessageDiv.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('LocationMessage',(messages)=>{
    const html=Mustache.render($URLTemplate,{
        username:messages.username,
        urli:messages.text,
        time:moment(messages.time).format('h:mm a')
    })
    $MessageDiv.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
   const html=Mustache.render(sidebarTemplate,{
       room,
       users
   })

   document.querySelector('#sidebar').innerHTML=html
})

$MessageForm.addEventListener('submit',(e)=>{
    e.preventDefault()//stops Refresh of page

    $MessageFormButton.setAttribute('disabled','disabled')//disabling untill get delivered

    const msg=e.target.elements.message.value
    socket.emit('SendMessage',msg,(message)=>{
        console.log('Message was delivered',message)
        $MessageFormButton.removeAttribute('disabled')
        $MessageForm.focus()
        $MessageInput.value=''
    })//sending to particular so after catching this on serverside it will broadcast to everyone
})

document.querySelector('#send_location').addEventListener('click',()=>{
    if(!navigator.geolocation)
        return alert("Your Browser doesnot support sharing Location")
        $LocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('SendLocation',{
            lattitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(msg)=>{
            console.log('Location is Delived',msg)
            $LocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join',({username,room}),(error)=>{
    if(error)
       {
        alert(error)
         location.href='/'
       }
        
})