const users=[]

const AddUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username||!room){
    
        return {
            error:'username and room must be provided'
        }
  
    }

    const existingUser=users.find((user)=>{
        return user.room===room&&user.username===username
    })

    if(existingUser){
        return {
            error:'username or room must not be same'
        }
    }

    const user={id,username,room}
    users.push(user)
    return { user}
       
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)

    if(index!=-1)
    {
        return users.splice(index,1)[0]//remove that given index('s if more with same id) and remove just one and return first element of removed([0])
    }
}

const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}

const getUserRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)//give filtered array of users in that room
}

module.exports={
    getUser,
    getUserRoom,
    removeUser,
    AddUser
}
